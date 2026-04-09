export const setPntStyle = ({ point, radius, fill })   => {
  point.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: radius,
      fill: new ol.style.Fill({
        color: fill,  // 确保 fill 是一个有效的颜色值
      }),
    }),
  }));
};
