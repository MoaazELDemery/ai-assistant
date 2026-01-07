import { requireNativeView } from 'expo';
import * as React from 'react';

import { AiAssistantViewProps } from './AiAssistant.types';

const NativeView: React.ComponentType<AiAssistantViewProps> =
  requireNativeView('AiAssistant');

export default function AiAssistantView(props: AiAssistantViewProps) {
  return <NativeView {...props} />;
}
