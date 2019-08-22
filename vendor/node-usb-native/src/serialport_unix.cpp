#include "./serialport.h"
#include "./serialport_poller.h"
#include <sys/file.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <termios.h>

#ifdef __APPLE__
#include <AvailabilityMacros.h>
#include <sys/param.h>
#include <IOKit/IOKitLib.h>
#include <IOKit/IOCFPlugIn.h>
#include <IOKit/usb/IOUSBLib.h>
#include <IOKit/serial/IOSerialKeys.h>

uv_mutex_t list_mutex;
Boolean lockInitialised = FALSE;
#endif

#if defined(MAC_OS_X_VERSION_10_4) && (MAC_OS_X_VERSION_MIN_REQUIRED >= MAC_OS_X_VERSION_10_4)
#include <sys/ioctl.h>
#include <IOKit/serial/ioss.h>
#endif

#if defined(__OpenBSD__)
#include <sys/ioctl.h>
#endif

#if defined(__linux__)
#include <sys/ioctl.h>
#include <linux/serial.h>
#endif

struct UnixPlatformOptions : OpenBatonPlatformOptions {
  uint8_t vmin;
  uint8_t vtime;
};

OpenBatonPlatformOptions* ParsePlatformOptions(const v8::Local<v8::Object>& options) {
  Nan::HandleScope scope;

  UnixPlatformOptions* result = new UnixPlatformOptions();
  #if NODE_MAJOR_VERSION >= 10
    result->vmin = Nan::Get(options, Nan::New<v8::String>("vmin").ToLocalChecked()).ToLocalChecked()->ToInt32(v8::Isolate::GetCurrent())->Int32Value();
    result->vtime = Nan::Get(options, Nan::New<v8::String>("vtime").ToLocalChecked()).ToLocalChecked()->ToInt32(v8::Isolate::GetCurrent())->Int32Value();
  #else
    result->vmin = Nan::Get(options, Nan::New<v8::String>("vmin").ToLocalChecked()).ToLocalChecked()->ToInt32()->Int32Value();
    result->vtime = Nan::Get(options, Nan::New<v8::String>("vtime").ToLocalChecked()).ToLocalChecked()->ToInt32()->Int32Value();
  #endif

  return result;
}

int ToBaudConstant(int baudRate);
int ToDataBitsConstant(int dataBits);
int ToStopBitsConstant(SerialPortStopBits stopBits);

void AfterOpenSuccess(int fd, Nan::Callback* dataCallback, Nan::Callback* disconnectedCallback, Nan::Callback* errorCallback) {
  delete dataCallback;
  delete errorCallback;
  delete disconnectedCallback;
}

int ToBaudConstant(int baudRate) {
  switch (baudRate) {
    case 0: return B0;
    case 50: return B50;
    case 75: return B75;
    case 110: return B110;
    case 134: return B134;
    case 150: return B150;
    case 200: return B200;
    case 300: return B300;
    case 600: return B600;
    case 1200: return B1200;
    case 1800: return B1800;
    case 2400: return B2400;
    case 4800: return B4800;
    case 9600: return B9600;
    case 19200: return B19200;
    case 38400: return B38400;
    case 57600: return B57600;
    case 115200: return B115200;
    case 230400: return B230400;
#if defined(__linux__)
    case 460800: return B460800;
    case 500000: return B500000;
    case 576000: return B576000;
    case 921600: return B921600;
    case 1000000: return B1000000;
    case 1152000: return B1152000;
    case 1500000: return B1500000;
    case 2000000: return B2000000;
    case 2500000: return B2500000;
    case 3000000: return B3000000;
    case 3500000: return B3500000;
    case 4000000: return B4000000;
#endif
  }
  return -1;
}

#ifdef __APPLE__
typedef struct SerialDevice {
    char port[MAXPATHLEN];
    char locationId[MAXPATHLEN];
    char vendorId[MAXPATHLEN];
    char productId[MAXPATHLEN];
    char manufacturer[MAXPATHLEN];
    char serialNumber[MAXPATHLEN];
} stSerialDevice;

typedef struct DeviceListItem {
    struct SerialDevice value;
    struct DeviceListItem *next;
    int* length;
} stDeviceListItem;
#endif

int ToDataBitsConstant(int dataBits) {
  switch (dataBits) {
    case 8: default: return CS8;
    case 7: return CS7;
    case 6: return CS6;
    case 5: return CS5;
  }
  return -1;
}

void EIO_Open(uv_work_t* req) {
  OpenBaton* data = static_cast<OpenBaton*>(req->data);

  int flags = (O_RDWR | O_NOCTTY | O_NONBLOCK | O_CLOEXEC | O_SYNC);
  int fd = open(data->path, flags);

  if (-1 == fd) {
    snprintf(data->errorString, sizeof(data->errorString), "Error: %s, cannot open %s", strerror(errno), data->path);
    return;
  }

  if (-1 == setup(fd, data)) {
    close(fd);
    return;
  }

  data->result = fd;
}

int setBaudRate(ConnectionOptionsBaton *data) {
  // lookup the standard baudrates from the table
  int baudRate = ToBaudConstant(data->baudRate);
  int fd = data->fd;

  // get port options
  struct termios options;
  if (tcgetattr(fd, &options)) {
    snprintf(data->errorString, sizeof(data->errorString), "Error: tcgetattr encountering %s", strerror(errno));
    return -1;
  }

  // If there is a custom baud rate on linux you can do the following trick with B38400
  #if defined(__linux__) && defined(ASYNC_SPD_CUST)
    if (baudRate == -1) {
      struct serial_struct serinfo;
      serinfo.reserved_char[0] = 0;
      if (-1 != ioctl(fd, TIOCGSERIAL, &serinfo)) {
        serinfo.flags &= ~ASYNC_SPD_MASK;
        serinfo.flags |= ASYNC_SPD_CUST;
        serinfo.custom_divisor = (serinfo.baud_base + (data->baudRate / 2)) / data->baudRate;
        if (serinfo.custom_divisor < 1)
          serinfo.custom_divisor = 1;

        ioctl(fd, TIOCSSERIAL, &serinfo);
        ioctl(fd, TIOCGSERIAL, &serinfo);
      } else {
        snprintf(data->errorString, sizeof(data->errorString), "Error: %s setting custom baud rate of %d", strerror(errno), data->baudRate);
        return -1;
      }

      // Now we use "B38400" to trigger the special baud rate.
      baudRate = B38400;
    }
  #endif

  // On OS X, starting with Tiger, we can set a custom baud rate with ioctl
  #if defined(MAC_OS_X_VERSION_10_4) && (MAC_OS_X_VERSION_MIN_REQUIRED >= MAC_OS_X_VERSION_10_4)
    if (-1 == baudRate) {
      speed_t speed = data->baudRate;
      if (-1 == ioctl(fd, IOSSIOSPEED, &speed)) {
        snprintf(data->errorString, sizeof(data->errorString), "Error: %s calling ioctl(.., IOSSIOSPEED, %ld )", strerror(errno), speed );
        return -1;
      } else {
        return 1;
      }
    }
  #endif

  // If we have a good baud rate set it and lets go
  if (-1 != baudRate) {
    cfsetospeed(&options, baudRate);
    cfsetispeed(&options, baudRate);
    tcflush(fd, TCIFLUSH);
    tcsetattr(fd, TCSANOW, &options);
    return 1;
  }

  snprintf(data->errorString, sizeof(data->errorString), "Error baud rate of %d is not supported on your platform", data->baudRate);
  return -1;
}

void EIO_Update(uv_work_t* req) {
  ConnectionOptionsBaton* data = static_cast<ConnectionOptionsBaton*>(req->data);
  setBaudRate(data);
}

int setup(int fd, OpenBaton *data) {
  UnixPlatformOptions* platformOptions = static_cast<UnixPlatformOptions*>(data->platformOptions);

  int dataBits = ToDataBitsConstant(data->dataBits);
  if (-1 == dataBits) {
    snprintf(data->errorString, sizeof(data->errorString), "Invalid data bits setting %d", data->dataBits);
    return -1;
  }

  // Snow Leopard doesn't have O_CLOEXEC
  if (-1 == fcntl(fd, F_SETFD, FD_CLOEXEC)) {
    snprintf(data->errorString, sizeof(data->errorString), "Error %s Cannot open %s", strerror(errno), data->path);
    return -1;
  }

  // Copy the connection options into the ConnectionOptionsBaton to set the baud rate
  ConnectionOptionsBaton* connectionOptions = new ConnectionOptionsBaton();
  memset(connectionOptions, 0, sizeof(ConnectionOptionsBaton));
  connectionOptions->fd = fd;
  connectionOptions->baudRate = data->baudRate;

  if (-1 == setBaudRate(connectionOptions)) {
    strncpy(data->errorString, connectionOptions->errorString, sizeof(data->errorString));
    delete(connectionOptions);
    return -1;
  }
  delete(connectionOptions);

  // Get port configuration for modification
  struct termios options;
  if (tcgetattr(fd, &options)) {
    snprintf(data->errorString, sizeof(data->errorString), "Error: tcgetattr encountering %s", strerror(errno));
    return -1;
  }

  // IGNPAR: ignore bytes with parity errors
  options.c_iflag = IGNPAR;

  // ICRNL: map CR to NL (otherwise a CR input on the other computer will not terminate input)
  // Future potential option
  // options.c_iflag = ICRNL;
  // otherwise make device raw (no other input processing)

  // Specify data bits
  options.c_cflag &= ~CSIZE;
  options.c_cflag |= dataBits;

  options.c_cflag &= ~(CRTSCTS);

  if (data->rtscts) {
    options.c_cflag |= CRTSCTS;
    // evaluate specific flow control options
  }

  options.c_iflag &= ~(IXON | IXOFF | IXANY);

  if (data->xon) {
    options.c_iflag |= IXON;
  }

  if (data->xoff) {
    options.c_iflag |= IXOFF;
  }

  if (data->xany) {
    options.c_iflag |= IXANY;
  }

  switch (data->parity) {
  case SERIALPORT_PARITY_NONE:
    options.c_cflag &= ~PARENB;
    // options.c_cflag &= ~CSTOPB;
    // options.c_cflag &= ~CSIZE;
    // options.c_cflag |= CS8;
    break;
  case SERIALPORT_PARITY_ODD:
    options.c_cflag |= PARENB;
    options.c_cflag |= PARODD;
    // options.c_cflag &= ~CSTOPB;
    // options.c_cflag &= ~CSIZE;
    // options.c_cflag |= CS7;
    break;
  case SERIALPORT_PARITY_EVEN:
    options.c_cflag |= PARENB;
    options.c_cflag &= ~PARODD;
    // options.c_cflag &= ~CSTOPB;
    // options.c_cflag &= ~CSIZE;
    // options.c_cflag |= CS7;
    break;
  default:
    snprintf(data->errorString, sizeof(data->errorString), "Invalid parity setting %d", data->parity);
    return -1;
  }

  switch (data->stopBits) {
  case SERIALPORT_STOPBITS_ONE:
    options.c_cflag &= ~CSTOPB;
    break;
  case SERIALPORT_STOPBITS_TWO:
    options.c_cflag |= CSTOPB;
    break;
  default:
    snprintf(data->errorString, sizeof(data->errorString), "Invalid stop bits setting %d", data->stopBits);
    return -1;
  }

  options.c_cflag |= CLOCAL;  // ignore status lines
  options.c_cflag |= CREAD;   // enable receiver
  if (data->hupcl) {
    options.c_cflag |= HUPCL;  // drop DTR (i.e. hangup) on close
  }

  // Raw output
  options.c_oflag = 0;

  // ICANON makes partial lines not readable. It should be optional.
  // It works with ICRNL.
  options.c_lflag = 0;  // ICANON;

  options.c_cc[VMIN]= platformOptions->vmin;
  options.c_cc[VTIME]= platformOptions->vtime;

  // why?
  tcflush(fd, TCIFLUSH);

  // check for error?
  tcsetattr(fd, TCSANOW, &options);

  if (data->lock){
    if (-1 == flock(fd, LOCK_EX | LOCK_NB)) {
      snprintf(data->errorString, sizeof(data->errorString), "Error %s Cannot lock port", strerror(errno));
      return -1;
    }
  }

  return 1;
}

void EIO_Write(uv_work_t* req) {
  QueuedWrite* queuedWrite = static_cast<QueuedWrite*>(req->data);
  WriteBaton* data = static_cast<WriteBaton*>(queuedWrite->baton);
  int bytesWritten = 0;

  do {
    errno = 0;  // probably don't need this
    bytesWritten = write(data->fd, data->bufferData + data->offset, data->bufferLength - data->offset);
    if (-1 != bytesWritten) {
      // there wasn't an error, do the math on what we actually wrote and keep writing until finished
      data->offset += bytesWritten;
      continue;
    }

    // The write call was interrupted before anything was written, try again immediately.
    if (errno == EINTR) {
      // why try again right away instead of in another event loop?
      continue;
    }

    // Try again in another event loop
    if (errno == EAGAIN || errno == EWOULDBLOCK){
      return;
    }

    // EBAD would mean we're "disconnected"

    // a real error so lets bail
    snprintf(data->errorString, sizeof(data->errorString), "Error: %s, calling write", strerror(errno));
    return;
  } while (data->bufferLength > data->offset);
}

void EIO_Close(uv_work_t* req) {
  CloseBaton* data = static_cast<CloseBaton*>(req->data);
  if (-1 == close(data->fd)) {
    snprintf(data->errorString, sizeof(data->errorString), "Error: %s, unable to close fd %d", strerror(errno), data->fd);
  }
}

#ifdef __APPLE__

// Function prototypes
static kern_return_t FindModems(io_iterator_t *matchingServices);
static io_service_t GetUsbDevice(io_service_t service);
static stDeviceListItem* GetSerialDevices();


static kern_return_t FindModems(io_iterator_t *matchingServices) {
    kern_return_t     kernResult;
    CFMutableDictionaryRef  classesToMatch;
    classesToMatch = IOServiceMatching(kIOSerialBSDServiceValue);
    if (classesToMatch != NULL) {
        CFDictionarySetValue(classesToMatch,
                             CFSTR(kIOSerialBSDTypeKey),
                             CFSTR(kIOSerialBSDAllTypes));
    }

    kernResult = IOServiceGetMatchingServices(kIOMasterPortDefault, classesToMatch, matchingServices);

    return kernResult;
}

static io_service_t GetUsbDevice(io_service_t service) {
  IOReturn status;
  io_iterator_t   iterator = 0;
  io_service_t    device = 0;

  if (!service) {
    return device;
  }

  status = IORegistryEntryCreateIterator(service,
                                         kIOServicePlane,
                                         (kIORegistryIterateParents | kIORegistryIterateRecursively),
                                         &iterator);

  if (status == kIOReturnSuccess) {
    io_service_t currentService;
    while ((currentService = IOIteratorNext(iterator)) && device == 0) {
      io_name_t serviceName;
      status = IORegistryEntryGetNameInPlane(currentService, kIOServicePlane, serviceName);
      if (status == kIOReturnSuccess && IOObjectConformsTo(currentService, kIOUSBDeviceClassName)) {
        device = currentService;
      } else {
        // Release the service object which is no longer needed
        (void) IOObjectRelease(currentService);
      }
    }

    // Release the iterator
    (void) IOObjectRelease(iterator);
  }

  return device;
}

static void ExtractUsbInformation(stSerialDevice *serialDevice, IOUSBDeviceInterface  **deviceInterface) {
  kern_return_t kernResult;
  UInt32 locationID;
  kernResult = (*deviceInterface)->GetLocationID(deviceInterface, &locationID);
  if (KERN_SUCCESS == kernResult) {
    snprintf(serialDevice->locationId, 11, "0x%08x", locationID);
  }

  UInt16 vendorID;
  kernResult = (*deviceInterface)->GetDeviceVendor(deviceInterface, &vendorID);
  if (KERN_SUCCESS == kernResult) {
    snprintf(serialDevice->vendorId, 7, "0x%04x", vendorID);
  }

  UInt16 productID;
  kernResult = (*deviceInterface)->GetDeviceProduct(deviceInterface, &productID);
  if (KERN_SUCCESS == kernResult) {
    snprintf(serialDevice->productId, 7, "0x%04x", productID);
  }
}

static stDeviceListItem* GetSerialDevices() {
  kern_return_t kernResult;
  io_iterator_t serialPortIterator;
  char bsdPath[MAXPATHLEN];

  FindModems(&serialPortIterator);

  io_service_t modemService;
  kernResult = KERN_FAILURE;
  Boolean modemFound = false;

  // Initialize the returned path
  *bsdPath = '\0';

  stDeviceListItem* devices = NULL;
  stDeviceListItem* lastDevice = NULL;
  int length = 0;

  while ((modemService = IOIteratorNext(serialPortIterator))) {
    CFTypeRef bsdPathAsCFString;
    bsdPathAsCFString = IORegistryEntrySearchCFProperty(
      modemService,
      kIOServicePlane,
      CFSTR(kIOCalloutDeviceKey),
      kCFAllocatorDefault,
      kIORegistryIterateRecursively);

    if (bsdPathAsCFString) {
      Boolean result;

      // Convert the path from a CFString to a C (NUL-terminated)
      result = CFStringGetCString((CFStringRef) bsdPathAsCFString,
                    bsdPath,
                    sizeof(bsdPath),
                    kCFStringEncodingUTF8);
      CFRelease(bsdPathAsCFString);

      if (result) {
        stDeviceListItem *deviceListItem = (stDeviceListItem*) malloc(sizeof(stDeviceListItem));
        stSerialDevice *serialDevice = &(deviceListItem->value);
        strcpy(serialDevice->port, bsdPath);
        memset(serialDevice->locationId, 0, sizeof(serialDevice->locationId));
        memset(serialDevice->vendorId, 0, sizeof(serialDevice->vendorId));
        memset(serialDevice->productId, 0, sizeof(serialDevice->productId));
        serialDevice->manufacturer[0] = '\0';
        serialDevice->serialNumber[0] = '\0';
        deviceListItem->next = NULL;
        deviceListItem->length = &length;

        if (devices == NULL) {
          devices = deviceListItem;
        } else {
          lastDevice->next = deviceListItem;
        }

        lastDevice = deviceListItem;
        length++;

        modemFound = true;
        kernResult = KERN_SUCCESS;

        uv_mutex_lock(&list_mutex);

        io_service_t device = GetUsbDevice(modemService);

        if (device) {
          CFStringRef manufacturerAsCFString = (CFStringRef) IORegistryEntryCreateCFProperty(device,
                      CFSTR(kUSBVendorString),
                      kCFAllocatorDefault,
                      0);

          if (manufacturerAsCFString) {
            Boolean result;
            char    manufacturer[MAXPATHLEN];

            // Convert from a CFString to a C (NUL-terminated)
            result = CFStringGetCString(manufacturerAsCFString,
                          manufacturer,
                          sizeof(manufacturer),
                          kCFStringEncodingUTF8);

            if (result) {
              strcpy(serialDevice->manufacturer, manufacturer);
            }

            CFRelease(manufacturerAsCFString);
          }

          CFStringRef serialNumberAsCFString = (CFStringRef) IORegistryEntrySearchCFProperty(device,
                      kIOServicePlane,
                      CFSTR(kUSBSerialNumberString),
                      kCFAllocatorDefault,
                      kIORegistryIterateRecursively);

          if (serialNumberAsCFString) {
            Boolean result;
            char    serialNumber[MAXPATHLEN];

            // Convert from a CFString to a C (NUL-terminated)
            result = CFStringGetCString(serialNumberAsCFString,
                          serialNumber,
                          sizeof(serialNumber),
                          kCFStringEncodingUTF8);

            if (result) {
              strcpy(serialDevice->serialNumber, serialNumber);
            }

            CFRelease(serialNumberAsCFString);
          }

          IOCFPlugInInterface **plugInInterface = NULL;
          SInt32        score;
          HRESULT       res;

          IOUSBDeviceInterface  **deviceInterface = NULL;

          kernResult = IOCreatePlugInInterfaceForService(device, kIOUSBDeviceUserClientTypeID, kIOCFPlugInInterfaceID,
                               &plugInInterface, &score);

          if ((kIOReturnSuccess != kernResult) || !plugInInterface) {
            continue;
          }

          // Use the plugin interface to retrieve the device interface.
          res = (*plugInInterface)->QueryInterface(plugInInterface, CFUUIDGetUUIDBytes(kIOUSBDeviceInterfaceID),
                               (LPVOID*) &deviceInterface);

          // Now done with the plugin interface.
          (*plugInInterface)->Release(plugInInterface);

          if (res || deviceInterface == NULL) {
            continue;
          }

          // Extract the desired Information
          ExtractUsbInformation(serialDevice, deviceInterface);

          // Release the Interface
          (*deviceInterface)->Release(deviceInterface);

          // Release the device
          (void) IOObjectRelease(device);
        }

        uv_mutex_unlock(&list_mutex);
      }
    }

    // Release the io_service_t now that we are done with it.
    (void) IOObjectRelease(modemService);
  }

  IOObjectRelease(serialPortIterator);  // Release the iterator.

  return devices;
}

#endif

void EIO_List(uv_work_t* req) {
  ListBaton* data = static_cast<ListBaton*>(req->data);

#ifndef __APPLE__
  // This code exists in javascript for other unix platforms
  snprintf(data->errorString, sizeof(data->errorString), "List is not Implemented");
  return;
# else
  if (!lockInitialised) {
    uv_mutex_init(&list_mutex);
    lockInitialised = TRUE;
  }

  stDeviceListItem* devices = GetSerialDevices();
  if (*(devices->length) > 0) {
    stDeviceListItem* next = devices;

    for (int i = 0, len = *(devices->length); i < len; i++) {
      stSerialDevice device = (* next).value;

      ListResultItem* resultItem = new ListResultItem();
      resultItem->comName = device.port;

      if (*device.locationId) {
        resultItem->locationId = device.locationId;
      }
      if (*device.vendorId) {
        resultItem->vendorId = device.vendorId;
      }
      if (*device.productId) {
        resultItem->productId = device.productId;
      }
      if (*device.manufacturer) {
        resultItem->manufacturer = device.manufacturer;
      }
      if (*device.serialNumber) {
        resultItem->serialNumber = device.serialNumber;
      }
      data->results.push_back(resultItem);

      stDeviceListItem* current = next;

      if (next->next != NULL) {
        next = next->next;
      }

      free(current);
    }
  }
#endif
}

void EIO_Flush(uv_work_t* req) {
  FlushBaton* data = static_cast<FlushBaton*>(req->data);

  data->result = tcflush(data->fd, TCIFLUSH);
}

void EIO_Set(uv_work_t* req) {
  SetBaton* data = static_cast<SetBaton*>(req->data);

  int bits;
  ioctl(data->fd, TIOCMGET, &bits);

  bits &= ~(TIOCM_RTS | TIOCM_CTS | TIOCM_DTR | TIOCM_DSR);

  if (data->rts) {
    bits |= TIOCM_RTS;
  }

  if (data->cts) {
    bits |= TIOCM_CTS;
  }

  if (data->dtr) {
    bits |= TIOCM_DTR;
  }

  if (data->dsr) {
    bits |= TIOCM_DSR;
  }

  int result = 0;
  if (data->brk) {
    result = ioctl(data->fd, TIOCSBRK, NULL);
  } else {
    result = ioctl(data->fd, TIOCCBRK, NULL);
  }

  if (-1 == result) {
    snprintf(data->errorString, sizeof(data->errorString), "Error: %s, cannot drain", strerror(errno));
    return;
  }

  if (-1 == ioctl(data->fd, TIOCMSET, &bits)) {
    snprintf(data->errorString, sizeof(data->errorString), "Error: %s, cannot drain", strerror(errno));
    return;
  }
}

void EIO_Drain(uv_work_t* req) {
  DrainBaton* data = static_cast<DrainBaton*>(req->data);

  if (-1 == tcdrain(data->fd)) {
    snprintf(data->errorString, sizeof(data->errorString), "Error: %s, cannot drain", strerror(errno));
    return;
  }
}
