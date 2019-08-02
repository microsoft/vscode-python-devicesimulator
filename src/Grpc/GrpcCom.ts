import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH =
  "C:Users\t-chcidoDocumentsAdafruitgitdebugger\vscode-python-embeddedsrcGrpcprotosstatecommunication.proto";
// const PROTO_PATH = "./protos/statecommunication.proto";

export class GrpcCom {
  private stateCommunication_proto: any;
  private currentState: string;

  constructor() {
    let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
    this.stateCommunication_proto = grpc.loadPackageDefinition(
      packageDefinition
    ).statecommunication;
    this.currentState = "{}";
  }

  public UpdateState(call: any, callback: any) {
    console.log("Updating state in TS");
    callback(null, this.handleState(call.request));
  }

  public run() {
    const server = new grpc.Server();
    console.error("In SERVER RUN");
    server.addService(this.stateCommunication_proto.TsServer.service, {
      updateState: this.UpdateState
    });
    server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
    console.error("BEFORE START SERVER RUN");
    server.start();
    // console.error("Current state in run : " + this.currentState);
  }

  private handleState = (newState: any) => {
    this.currentState = newState.state;
    let ack = { ackMessage: "State updated to " + newState.state };
    // return ack;
  };
}
