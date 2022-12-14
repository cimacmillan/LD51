import React = require("react");
import { connect } from "react-redux";
import { State } from "../State";
import { useGlobalState } from "../effects/GlobalState";
import { ServiceLocator } from "../../services/ServiceLocator";
import { FadeComponent } from "../components/FadeComponent";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";

interface GameFadeContainerProps {}

export const GameFadeContainer: React.FunctionComponent<GameFadeContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    return (
        <FadeComponent
            shouldShow={state.gameStart.showingFade}
            fadeInSpeed={1000}
            fadeOutSpeed={300}
            render={(x) =>
                x === 0 ? (
                    <></>
                ) : (
                    <div
                        style={{
                            width: DOM_WIDTH,
                            height: DOM_HEIGHT,
                            position: "absolute",
                            backgroundColor: "#000000",
                            opacity: x,
                        }}
                    />
                )
            }
        ></FadeComponent>
    );
};
