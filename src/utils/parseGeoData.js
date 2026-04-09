// utils/parseGeoData.js

import defaultGeoData from '@/assets/SCdiaster.json';

/**
 * 解析GeoJSON数据并提取关键信息
 * @param {Object} geoData - GeoJSON数据（可选，默认为 SCdiaster.json）
 * @returns {Object} 包含灾害体类型分布、威胁人口和财产、地震烈度、市级灾害点数量的数据对象
 */
export function parseGeoData(geoData = defaultGeoData) {
  const disasterTypeCounts = {};
  const threatPopulation = [];
  const threatProperty = [];
  const intensityCounts = {};
  const groundwaterTypeCounts = {};
  const cityCounts = {};  // 添加市级统计

  geoData.features.forEach((feature) => {
    const props = feature.properties;

    // 统计灾害体类型
    const type = props.灾害体类型;
    disasterTypeCounts[type] = (disasterTypeCounts[type] || 0) + 1;

    // 收集威胁人口和财产数据
    threatPopulation.push({ name: props.灾害体名称, value: props.威胁人口 });
    threatProperty.push({ name: props.灾害体名称, value: props.威胁财产 });

    // 地震烈度统计
    const intensity = props.地震烈度;
    intensityCounts[intensity] = (intensityCounts[intensity] || 0) + 1;

    // 地下水类型统计
    const groundwaterType = props.地下水类型;
    if (groundwaterType) {
      groundwaterTypeCounts[groundwaterType] = (groundwaterTypeCounts[groundwaterType] || 0) + 1;
    }

    // 市级统计
    const city = props.市; // 假设市级信息在'市'字段中
    if (city) {
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    }
  });
  
  return {
    disasterTypeCounts,
    threatPopulation,
    threatProperty,
    intensityCounts,
    groundwaterTypeCounts,
    cityCounts,  // 返回市级统计数据
  };
}
