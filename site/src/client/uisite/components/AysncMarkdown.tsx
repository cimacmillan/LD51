import React = require("react");
import * as ReactMarkdown from "react-markdown";
import { AsyncMarkdownRenderers } from "./AsyncMarkdownRenderers";

interface AsyncMarkdownProps extends ReactMarkdown.ReactMarkdownProps {
    url: string;
}

export const AsyncMarkdown: React.FunctionComponent<AsyncMarkdownProps> = (
    props
) => {
    const [source, setSource] = React.useState("Loading");
    React.useEffect(() => {
        fetch(props.url)
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                setSource(text);
            })
            .catch((e) => setSource(`${e}`));
    }, [props.url]);
    return (
        <ReactMarkdown
            {...props}
            source={source}
            renderers={AsyncMarkdownRenderers()}
            transformImageUri={(uri) => `doc/deepdive/${uri}`}
        />
    );
};
