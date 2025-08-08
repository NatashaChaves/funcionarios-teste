import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { TokenInterceptor } from './app/interceptors/tokenInterceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';


bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(
      withInterceptors([TokenInterceptor])),
    provideNgxMask(),
  ]
})
.catch((err) => console.error(err));
