const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
  activateDarkMode()
}

function activateDarkMode() {
  const rootElement = document.querySelector<HTMLHtmlElement>(':root');
  const darkTheme: {[key: string]: string} = {
    '--main-text-color': '#F2F2F2',
    '--second-text-color': '#B3B3B3',
    '--main-icon-color': '#494949',
    '--main-background': '#333333',
    '--second-background': '#B3B3B3',
    '--header-color': '#494949',
    '--main-button-text-color': '#fff',
    '--box-shadow': 'rgba(250, 250, 250, 0.247)',
    '--normal-btn-background': '#B72025',
    '--disabled-btn-background': '#666666',
    '--hover-btn-background': '#a51015',
    '--active-btn-background': '#6b1619',
    '--second-color': 'rgba( 0, 0, 0, 0.3)',
    '--main-btn': 'rgb(183, 32, 37)',
    '--disabled-btn': 'rgba(183, 32, 37, .5)',
    '--error': 'red',
  };
  
  localStorage.setItem('theme', 'dark');

  for (let color in darkTheme) {
    rootElement?.style.setProperty(color, darkTheme[color]);
  }
}

function activateLightMode() {
  const rootElement = document.querySelector<HTMLElement>(':root');
  const lightTheme: {[key: string]: string} = {
    '--main-text-color': '#333333',
    '--second-text-color': '#B3B3B3',
    '--main-icon-color': '#494949',
    '--main-background': '#F2F2F2',
    '--second-background': '#fff',
    '--header-color': '#333333',
    '--main-button-text-color': '#fff',
    '--box-shadow': 'rgba(183, 32, 37, 0.15)',
    '--normal-btn-background': '#B72025',
    '--disabled-btn-background': '#E98185',
    '--hover-btn-background': '#D3040B',
    '--active-btn-background': '#89181C',
    '--second-color': 'rgba( 0, 0, 0, 0.3)',
    '--main-btn': 'rgb(183, 32, 37)',
    '--disabled-btn': 'rgba(183, 32, 37, .5)',
    '--error': 'red',
  };

  localStorage.setItem('theme', 'light');

  for (let color in lightTheme) {
    rootElement?.style.setProperty(color, lightTheme[color]);
  }
}

export function onChangeMode() {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === null || currentTheme === 'light') {
    activateDarkMode()
  } else {
    activateLightMode()
  }
}
