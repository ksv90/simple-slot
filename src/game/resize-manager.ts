import { Application } from 'pixi.js';

export type ResizeManagerConfig = {
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly contentWidth: number;
  readonly contentHeight: number;
  readonly aspectRatio?: {
    readonly width: number;
    readonly height: number;
  };
};

export class ResizeManager {
  protected resizeObserver?: globalThis.ResizeObserver;

  protected resizeCallback?: () => void;

  protected tickerCallback?: () => void;

  protected sizeConfig: ResizeManagerConfig;

  constructor(
    protected readonly app: Application,
    sizeConfig?: ResizeManagerConfig,
  ) {
    this.sizeConfig = sizeConfig || {
      canvasWidth: 1920,
      canvasHeight: 1920,
      contentWidth: 1080,
      contentHeight: 1080,
    };
  }

  public start(): void {
    const { parentElement } = this.app.view;
    if (!parentElement) throw new Error('Application parent element not found');

    if (window.ResizeObserver) {
      this.resizeObserver = new window.ResizeObserver((resizeObserverEntries) => {
        resizeObserverEntries.forEach(({ contentRect }) => {
          this.resize(contentRect.width, contentRect.height);
        });
      });
      this.resizeObserver.observe(parentElement);
    } else {
      this.resizeCallback = () => {
        this.resize(parentElement.clientWidth, parentElement.clientHeight);
      };
      window.addEventListener('resize', this.resizeCallback);
    }
  }

  public stop(): void {
    this.resizeObserver?.disconnect();
    if (this.resizeCallback) window.removeEventListener('resize', this.resizeCallback);
  }

  protected resize = (width: number, height: number): void => {
    const { canvas, stage, renderer, ticker } = this.app;
    const { contentWidth, contentHeight, canvasWidth, canvasHeight } = this.sizeConfig;

    if (this.tickerCallback) ticker.remove(this.tickerCallback);

    this.tickerCallback = () => {
      this.tickerCallback = undefined;
      const { aspectRatio } = this.sizeConfig;

      let contentScale;
      if (aspectRatio) {
        const ratio = aspectRatio.width / aspectRatio.height;
        contentScale = Math.max(Math.min((width * ratio) / height, (height * ratio) / width), 1);
      } else {
        contentScale = 1;
      }

      const scale = Math.min(width / (contentWidth * contentScale), height / (contentHeight * contentScale));

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      renderer.resize(width, height);
      stage.scale.set(scale, scale);

      stage.x = Math.round((width - canvasWidth * scale) * 0.5);
      stage.y = Math.round((height - canvasHeight * scale) * 0.5);
    };

    ticker.addOnce(this.tickerCallback);
  };
}
