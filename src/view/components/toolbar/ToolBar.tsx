// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { TooltipHost } from "office-ui-fabric-react";
import * as React from "react";
import {
    FormattedMessage,
    injectIntl,
    WrappedComponentProps,
} from "react-intl";
import { SENSOR_LIST } from "../../constants";
import "../../styles/ToolBar.css";
import Button from "../Button";
import {
    DEFAULT_MODAL_CONTENT,
    getModalContent,
    IModalContent,
} from "./SensorModalUtils";

interface IToolbarState {
    currentOpenedId: string;
    showModal: boolean;
}

interface IProps extends WrappedComponentProps {
    buttonList: Array<{
        label: any;
        image: any;
    }>;
    onUpdateSensor: (sensor: SENSOR_LIST, value: number) => void;
    sensorValues: { [key: string]: number };
}

class ToolBar extends React.Component<IProps, IToolbarState, any> {
    private readonly TOOLBAR_BUTTON_WIDTH: number = 32;

    constructor(props: IProps) {
        super(props);
        this.state = {
            currentOpenedId: "",
            showModal: false,
        };
    }

    public render() {
        const { buttonList } = this.props;
        return (
            <div className="toolbar-parent" id="toolbar-parent">
                <div className="toolbar">
                    <div className="toolbar-icon">
                        {buttonList.map(
                            (currrentButton: any, index: number) => {
                                return (
                                    <TooltipHost
                                        tooltipProps={{
                                            onRenderContent: () => (
                                                <FormattedMessage
                                                    id={`${currrentButton.label}.title`}
                                                />
                                            ),
                                        }}
                                        key={index}
                                    >
                                        <Button
                                            key={index}
                                            label={currrentButton.label}
                                            width={this.TOOLBAR_BUTTON_WIDTH}
                                            onClick={(
                                                e: React.MouseEvent<HTMLElement>
                                            ) => {
                                                this.handleOnClick(
                                                    e,
                                                    currrentButton.label
                                                );
                                            }}
                                            image={currrentButton.image}
                                            styleLabel="toolbar"
                                            focusable={true}
                                        />
                                    </TooltipHost>
                                );
                            }
                        )}
                    </div>
                    {this.getIconModal()}
                </div>
            </div>
        );
    }

    private handleOnClick = (
        event: React.MouseEvent<HTMLElement>,
        label: string
    ) => {
        if (
            !this.state.showModal &&
            this.state.currentOpenedId === "" &&
            this.state.currentOpenedId !== label
        ) {
            this.openModal(label);
        } else {
            this.closeCurrentModal();
            if (this.state.currentOpenedId !== label) {
                this.openModal(label);
            }
        }
    };

    private changePressedState(id: string, pressed: boolean) {
        const elt = window.document.getElementById(`${id}-button`);
        if (elt) {
            pressed
                ? elt.classList.add("button-pressed")
                : elt.classList.remove("button-pressed");
        }
    }
    private closeCurrentModal = () => {
        this.changePressedState(this.state.currentOpenedId, false);
        this.setState({
            currentOpenedId: "",
            showModal: false,
        });
    };

    private openModal = (label: string) => {
        this.setState({
            currentOpenedId: label,
            showModal: true,
        });
        this.changePressedState(label, true);
    };

    private getIconModal() {
        if (
            !this.state.showModal ||
            !getModalContent(
                this.state.currentOpenedId,
                this.props.onUpdateSensor,
                this.props.sensorValues
            )
        ) {
            return null;
        }

        const content = getModalContent(
            this.state.currentOpenedId,
            this.props.onUpdateSensor,
            this.props.sensorValues
        ) as IModalContent;

        const component = content
            ? content.component
            : DEFAULT_MODAL_CONTENT.component;
        return (
            <div className="sensor_modal">
                <div className="title_group">
                    <span className="title">
                        <FormattedMessage id={content.descriptionTitle} />
                        {content.tagInput}
                        {content.tagOutput}
                    </span>
                </div>
                <br />
                <div className="description">
                    <FormattedMessage id={content.descriptionText} />
                </div>
                <div className="try_area">
                    <br />
                    <span className="description">
                        <FormattedMessage id={content.tryItDescription} />
                    </span>
                    <br />

                    <div>{component}</div>
                </div>
            </div>
        );
    }
}

export default injectIntl(ToolBar);
