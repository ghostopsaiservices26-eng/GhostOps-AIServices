import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { HowItWorks } from './pages/how-it-works/how-it-works';
import { Contact } from './pages/contact/contact';
import { WebglShader } from './components/webgl-shader/webgl-shader';
import { ThreeBackground } from './components/three-background/three-background';
import { ScrollAnimate } from './directives/scroll-animate';

@NgModule({
  declarations: [
    App,
    Navbar,
    Footer,
    Home,
    Services,
    HowItWorks,
    Contact,
    WebglShader,
    ThreeBackground,
    ScrollAnimate,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
