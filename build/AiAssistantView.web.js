import * as React from 'react';
export default function AiAssistantView(props) {
    return (<div>
      <iframe style={{ flex: 1 }} src={props.url} onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}/>
    </div>);
}
//# sourceMappingURL=AiAssistantView.web.js.map