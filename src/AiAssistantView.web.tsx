import * as React from 'react';

import { AiAssistantViewProps } from './AiAssistant.types';

export default function AiAssistantView(props: AiAssistantViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
