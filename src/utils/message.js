// ai-messageExtend.js
import { createApp } from 'vue';
import GlobalMessage from '@/components/Message.vue';

export default {
    install(app) {
        const messageApp = createApp(GlobalMessage);
        const instance = messageApp.mount(document.createElement('div'));
        document.body.appendChild(instance.$el);

        app.config.globalProperties.$MessageAi = {
            showMessage(message) {
                instance.showMessage(message);
            }
        };
    }
};
