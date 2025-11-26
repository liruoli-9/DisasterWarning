// AMapLoader.js
export function loadAMap() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://webapi.amap.com/maps?v=2.0&key=b15405e34cfe7e7c56ab9af861ce5c88&plugins=AMap.ToolBar,AMap.Scale";
    script.async = true;
    script.onload = () => resolve(window.AMap);
    script.onerror = reject;

    document.head.appendChild(script);
  });
}
