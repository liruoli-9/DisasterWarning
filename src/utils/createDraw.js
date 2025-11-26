/**
 * 创建绘制工具函数
 * @param {string} type - 绘制的类型，可以是 [Square, Box, Point, LineString, Circle, Polygon]
 * @param {ol.source.Vector} source - 绘制的目标源（图层数据源）
 * @param {function} [success] - 可选的成功回调函数，在绘制完成时调用
 * @returns {ol.interaction.Draw} - 返回一个绘制工具实例
 */
export function createDraw({ type, source, success }) {
  let geometryFunction = null; // 几何图形生成函数，默认为null
  let maxPoints = null; // 最大点数，默认为null
  
  // 如果类型是“Square”，将其更改为“Circle”，并使用正方形的几何生成函数
  if (type === "Square") {
    type = "Circle"; // 将类型更改为“Circle”
    geometryFunction = ol.interaction.Draw.createRegularPolygon(4); // 创建正方形
  }

  // 如果类型是“Box”，将其更改为“LineString”，并自定义几何生成函数来绘制矩形
  if (type === "Box") {
    type = "LineString"; // 将类型更改为“LineString”
    geometryFunction = function (coordinates, geometry) {
      if (!geometry) {
        geometry = new ol.geom.Polygon(null); // 创建一个空的多边形
      }
      const start = coordinates[0];
      const end = coordinates[1];
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start],
      ]); // 设置矩形的四个顶点和起始点
      return geometry;
    };
    maxPoints = 2; // 矩形只需两个点
  }

  // 创建一个绘制工具实例
  let draw = new ol.interaction.Draw({
    type, // 绘制的类型(Point, LineString, Circle, Polygon无需单独处理)
    source, // 数据源
    geometryFunction, // 几何图形生成函数
    maxPoints, // 最大点数
  });

  // 如果 success 是函数，为 draw 对象添加事件监听器
  if (typeof success === "function") {
    draw.on("drawend", (evt) => {
      // 当绘制完成时（即 'drawend' 事件触发），调用 success 函数
      // 将绘制完成的要素（feature）作为参数传递给 success 函数
      success(evt.feature);
    });
  }
  
  return draw; // 返回绘制工具实例
}
