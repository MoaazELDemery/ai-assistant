import { registerWebModule, NativeModule } from 'expo';

import { AiAssistantModuleEvents } from './AiAssistant.types';

class AiAssistantModule extends NativeModule<AiAssistantModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(AiAssistantModule, 'AiAssistantModule');
