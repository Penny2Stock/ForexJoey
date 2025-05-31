interface TradingViewWidgetOptions {
  autosize?: boolean;
  symbol?: string;
  interval?: string;
  timezone?: string;
  theme?: string;
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id?: string;
  studies?: string[];
  disabled_features?: string[];
  enabled_features?: string[];
  withdateranges?: boolean;
  hide_side_toolbar?: boolean;
  details?: boolean;
  hotlist?: boolean;
  calendar?: boolean;
  width?: string | number;
  height?: string | number;
  save_image?: boolean;
  hide_top_toolbar?: boolean;
  hide_legend?: boolean;
}

interface TradingViewWidget {
  new (options: TradingViewWidgetOptions): TradingViewWidget;
}

interface TradingViewStatic {
  widget: TradingViewWidget;
}

interface Window {
  TradingView?: TradingViewStatic;
}
