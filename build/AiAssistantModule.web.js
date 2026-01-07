import { registerWebModule, NativeModule } from 'expo';
class AiAssistantModule extends NativeModule {
    PI = Math.PI;
    async setValueAsync(value) {
        this.emit('onChange', { value });
    }
    hello() {
        return 'Hello world! 👋';
    }
}
export default registerWebModule(AiAssistantModule, 'AiAssistantModule');
//# sourceMappingURL=AiAssistantModule.web.js.map