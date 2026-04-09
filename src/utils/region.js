import axios from "axios";
// 风险表示：低度风险(1)、中度风险(2)、高度风险(3)、极高度风险(4)


let regions={
  data: [
    {
      "serial_number": 1,
      "hazard_id": "LX-X1",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "海东市民和县",
      "coordinates": "102°49′55.81″E, 36°18′37.47″N",
      "location_mileage": "K1728+700～K1729+000",
      "project_name": "东垣特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 2,
      "hazard_id": "LX-X2",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "海东市民和县",
      "coordinates": "102°49′35.60″E, 36°18′43.25″N",
      "location_mileage": "K1729+350～+550",
      "project_name": "东垣特大桥乌台、民和隧道",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 3,
      "hazard_id": "LX-X3",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "海东市民和县",
      "coordinates": "102°47′31.41″E, 36°19′11.65″N",
      "location_mileage": "K1732+720～+800",
      "project_name": "红崖村隧道进口明洞",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 4,
      "hazard_id": "LX-N1",
      "hazard_type": "泥石流",
      "administrative_area": "海东市民和县",
      "coordinates": "102°46′59.96″E, 36°19′16.00″N",
      "location_mileage": "K1733+470",
      "project_name": "南大沟中桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 5,
      "hazard_id": "LX-B1",
      "hazard_type": "危岩、落石",
      "administrative_area": "海东市民和县",
      "coordinates": "102°28′6.66″E, 36°26′44.89″N",
      "location_mileage": "K1765+100～+130",
      "project_name": "下沈家沟隧道出口",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 6,
      "hazard_id": "LX-H1",
      "hazard_type": "滑坡",
      "administrative_area": "海东市乐都区",
      "coordinates": "102°28′8.65″E, 36°26′37.16″N",
      "location_mileage": "K1764+800～K1765+050",
      "project_name": "东湾沟特大桥兰州台",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "严重",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 7,
      "hazard_id": "LX-N2",
      "hazard_type": "泥石流",
      "administrative_area": "海东市乐都区",
      "coordinates": "102°24′13.37″E, 36°27′59.88″N",
      "location_mileage": "K1771+315",
      "project_name": "乐都隧道出口、路基",
      "inducing_factors": "降雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 8,
      "hazard_id": "LX-N3",
      "hazard_type": "泥石流",
      "administrative_area": "海东市乐都区",
      "coordinates": "102°23′37.20″E, 36°27′54.44″N",
      "location_mileage": "K1772+300",
      "project_name": "海东站、乐都变电所",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 9,
      "hazard_id": "LX-X4",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "海东市乐都区",
      "coordinates": "102°15′20.44″E, 36°28′27.28″N",
      "location_mileage": "K1784+600～+730",
      "project_name": "红沟特大桥",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 10,
      "hazard_id": "LX-X5",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "海东市乐都区",
      "coordinates": "102°15′15.59″E, 36°28′27.85″N",
      "location_mileage": "K1784+760～＋820",
      "project_name": "红沟特大桥",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 11,
      "hazard_id": "LX-N4",
      "hazard_type": "泥石流",
      "administrative_area": "海东市乐都区",
      "coordinates": "102°15′4.04″E, 36°28′26.68″N",
      "location_mileage": "K1785+100",
      "project_name": "中桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 12,
      "hazard_id": "LX-B2",
      "hazard_type": "崩塌（危岩、落石）",
      "administrative_area": "海东市乐都区",
      "coordinates": "102°15′0.51″E, 36°28′27.78″N",
      "location_mileage": "K1785+139～＋180",
      "project_name": "红山二号隧道进口",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 13,
      "hazard_id": "LX-B3",
      "hazard_type": "崩塌（危岩、落石）",
      "administrative_area": "海东市乐都区",
      "coordinates": "102°14′12.96″E, 36°28′24.81″N",
      "location_mileage": "K1786+400～+454",
      "project_name": "红山二号隧道出口",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 14,
      "hazard_id": "LX-H2",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°54′10.97″E, 36°34′6.37″N",
      "location_mileage": "K1818+900～+950",
      "project_name": "小峡湟水河特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 15,
      "hazard_id": "LX-X6",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°54′9.11″E, 36°34′5.92″N",
      "location_mileage": "K1818+935～+965",
      "project_name": "小峡湟水河特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "严重",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 16,
      "hazard_id": "LX-B4",
      "hazard_type": "危岩落石",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°53′59.52″E, 36°34′14.27″N",
      "location_mileage": "K1819+280～+310",
      "project_name": "付家寨一号隧道出口",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 17,
      "hazard_id": "LX-N5",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°53′59.52″E, 36°34′14.27″N",
      "location_mileage": "K1819+320～+370",
      "project_name": "付家寨3号中桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 18,
      "hazard_id": "LX-B5",
      "hazard_type": "危岩落石",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°53′55.54″E, 36°34′16.56″N",
      "location_mileage": "K1819+380～+430",
      "project_name": "付家寨二号隧道进口",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 19,
      "hazard_id": "LX-B6",
      "hazard_type": "崩塌",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°53′50.56″E, 36°34′20.56″N",
      "location_mileage": "K1819+580～+620",
      "project_name": "付家寨二号隧道出口",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 20,
      "hazard_id": "LX-N6",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°53′48.63″E, 36°34′21.17″N",
      "location_mileage": "K1819+620～+680",
      "project_name": "付家寨4号中桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 21,
      "hazard_id": "LX-X7",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°50′59.94″E, 36°35′30.79″N",
      "location_mileage": "K1824+270～+480",
      "project_name": "西宁跨兰西特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 22,
      "hazard_id": "LX-N7",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°50′52.47″E, 36°35′34.29″N",
      "location_mileage": "K1824+600～+630",
      "project_name": "西宁跨兰西特大桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 23,
      "hazard_id": "LX-H3",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°50′51.51″E, 36°35′35.78″N",
      "location_mileage": "K1824+630～+680",
      "project_name": "西宁跨兰西特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "严重",
      "railway_hazard_level": "危险",
      "safety_risk_level": "高度风险",
      "final_risk": ""
    },
    {
      "serial_number": 24,
      "hazard_id": "LX-X8",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°50′48.13″E, 36°35′37.59″N",
      "location_mileage": "K1824+690～+920",
      "project_name": "西宁跨兰西特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 25,
      "hazard_id": "LX-X9",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°50′41.19″E, 36°35′40.86″N",
      "location_mileage": "K1824+920～K1825+080",
      "project_name": "西宁跨兰西特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "严重",
      "railway_hazard_level": "危险",
      "safety_risk_level": "高度风险",
      "final_risk": ""
    },
    {
      "serial_number": 26,
      "hazard_id": "LX-X10",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°50′33.25″E, 36°35′45.98″N",
      "location_mileage": "K1825+160～+300",
      "project_name": "西宁跨兰西特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "严重",
      "railway_hazard_level": "危险",
      "safety_risk_level": "高度风险",
      "final_risk": ""
    },
    {
      "serial_number": 27,
      "hazard_id": "LX-X11",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°50′24.17″E, 36°35′54.26″N",
      "location_mileage": "K1825+500～+600 右侧 40～50m",
      "project_name": "西宁跨兰西特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 28,
      "hazard_id": "LX-X12",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "西宁市城东区",
      "coordinates": "101°50′19.33″E, 36°35′58.86″N",
      "location_mileage": "K1825+650～+800 右侧 60～80m",
      "project_name": "西宁跨兰西特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 29,
      "hazard_id": "LX-X13",
      "hazard_type": "不稳定斜坡",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′30.38″E, 36°40′26.97″N",
      "location_mileage": "K1835+780～+860 右侧",
      "project_name": "西宁隧道出口、二十里铺特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "危险",
      "safety_risk_level": "高度风险",
      "final_risk": ""
    },
    {
      "serial_number": 30,
      "hazard_id": "LX-H4",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′30.38″E, 36°40′26.97″N",
      "location_mileage": "K1835+870～+920 右侧 42～52m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "危险",
      "safety_risk_level": "高度风险",
      "final_risk": ""
    },
    {
      "serial_number": 31,
      "hazard_id": "LX-B7",
      "hazard_type": "崩塌",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′26.61″E, 36°40′34.63″N",
      "location_mileage": "K1836+120 右侧 40m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "灌溉、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 32,
      "hazard_id": "LX-N8",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′22.79″E, 36°40′34.20″N",
      "location_mileage": "K1836+140",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 33,
      "hazard_id": "LX-H5",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′25.85″E, 36°40′41.56″N",
      "location_mileage": "K1836+320～K1836+450 右侧 35～70m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 34,
      "hazard_id": "LX-H6",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′23.26″E, 36°40′46.77″N",
      "location_mileage": "K1836+450～+650 右侧 70～110m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "极严重",
      "railway_hazard_level": "极危险",
      "safety_risk_level": "极高风险",
      "final_risk": ""
    },
    {
      "serial_number": 35,
      "hazard_id": "LX-H7",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′28.63″E, 36°40′56.40″N",
      "location_mileage": "K1836+700～+900 右侧 120～190m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 36,
      "hazard_id": "LX-H8",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′26.17″E, 36°41′5.07″N",
      "location_mileage": "K1837+000～+120 右侧 220～260m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 37,
      "hazard_id": "LX-H9",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′28.36″E, 36°41′10.03″N",
      "location_mileage": "K1837+120～+310 右侧 265～285m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 38,
      "hazard_id": "LX-H10",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′29.32″E, 36°41′15.22″N",
      "location_mileage": "K1837+320～+500 右侧 285～336m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "降雨、灌溉、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 39,
      "hazard_id": "LX-N9",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市城北区",
      "coordinates": "101°46′47.21″E, 36°43′37.27″N",
      "location_mileage": "K1841+650 右侧 630m",
      "project_name": "二十里铺特大桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 40,
      "hazard_id": "LX-N10",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°46′41.31″E, 36°45′9.59″N",
      "location_mileage": "K1844+700 右 360m",
      "project_name": "小桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 41,
      "hazard_id": "LX-N11",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°46′49.95″E, 36°46′44.58″N",
      "location_mileage": "K1847+530 右 290m",
      "project_name": "小桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 42,
      "hazard_id": "LX-H11",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°46′43.15″E, 36°47′10.63″N",
      "location_mileage": "K1848+000～+980 右侧 70～120m",
      "project_name": "路基",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 43,
      "hazard_id": "LX-N12",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°46′56.53″E, 36°47′41.55″N",
      "location_mileage": "K1849+080 右 330m",
      "project_name": "小桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 44,
      "hazard_id": "LX-H12",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°46′51.84″E, 36°48′26.78″N",
      "location_mileage": "K1850+400～+600 右侧 260m",
      "project_name": "路基",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 45,
      "hazard_id": "LX-N13",
      "hazard_type": "泥石流",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°46′40.73″E, 36°48′23.54″N",
      "location_mileage": "K1850+630 右 220m",
      "project_name": "小桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 46,
      "hazard_id": "LX-H13",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°46′48.60″E, 36°48′37.54″N",
      "location_mileage": "K1850+800～K1851+200 右侧 240m",
      "project_name": "路基",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 47,
      "hazard_id": "LX-H14",
      "hazard_type": "滑坡",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°46′43.07″E, 36°49′11.77″N",
      "location_mileage": "K1851+700～K1852+400 右侧 240m",
      "project_name": "路基",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "轻微",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 48,
      "hazard_id": "LX-B8",
      "hazard_type": "崩塌（危岩、落石）",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°41′50.69″E, 36°56′37.13″N",
      "location_mileage": "K1867+650～+780 左 2～5m",
      "project_name": "东峡特大桥",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "中等",
      "safety_risk_level": "中度风险",
      "final_risk": ""
    },
    {
      "serial_number": 49,
      "hazard_id": "LX-N14",
      "hazard_type": "山洪",
      "administrative_area": "西宁市大通县",
      "coordinates": "101°35′18.35″E, 37°11′7.31″N",
      "location_mileage": "K1897+050",
      "project_name": "三塘沟大桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "严重",
      "railway_hazard_level": "危险",
      "safety_risk_level": "高度风险",
      "final_risk": ""
    },
    {
      "serial_number": 50,
      "hazard_id": "LX-B9",
      "hazard_type": "崩塌（危岩、落石）",
      "administrative_area": "海北州门源县",
      "coordinates": "101°36′3.62″E, 37°19′51.41″N",
      "location_mileage": "K1913+462～+560",
      "project_name": "俄博山隧道进口",
      "inducing_factors": "降雨、地震",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    },
    {
      "serial_number": 51,
      "hazard_id": "LX-N15",
      "hazard_type": "洪水",
      "administrative_area": "海北州门源县",
      "coordinates": "101°33′54.77″E, 37°23′36.11″N",
      "location_mileage": "K1921+280～+450",
      "project_name": "大通河特大桥",
      "inducing_factors": "暴雨",
      "hazard_severity": "中等",
      "railway_hazard_level": "一般",
      "safety_risk_level": "低度风险",
      "final_risk": ""
    }
  ],
  getData(){
    return "消息暴漏成功！"
  }
};

let wRegions=['海东', '西宁', '海北'];
// let wRegions=['haidong', 'changsha', 'wuhan'];\
// 无风险区域(0): 0
// 低度风险 (1)：降雨量 < 5 mm
// 中度风险 (2)：降雨量 >= 5 mm 且 < 10 mm
// 高度风险 (3)：降雨量 >= 10 mm 且 < 15 mm
// 极高度风险 (4)：降雨量 >= 15 mm

let regionRainfall = {}  //区域降雨量

getDataFromApi.apply(this, wRegions);
getDataFromApi.apply(this, regionRainfall);
function getDataFromApi() {
  // 创建一个 Promise 数组来处理所有异步请求
  let requests = wRegions.map((region, index) => {
    return axios.get('https://api.seniverse.com/v3/weather/daily.json', {
      params: {
        key: 'SzPhoxwQ75omAHo4V',
        location: region,
        language: 'zh-Hans',
        unit: 'c',
        start: '-1',
        days: '2'
      }
    }).then(res => {
      const weatherData = res.data.results[0].daily;
      regionRainfall[region] = weatherData[0].rainfall; // 只取第一个元素的降雨量
    }).catch(err => {
      console.log(err);
    });
  });
  // 使用 Promise.all 等待所有请求完成后再处理数据
  return Promise.all(requests).then(() => {
    console.log("================获得的降雨量数据===============", regionRainfall);
    return regionRainfall;
  });
}
// 调用函数并处理返回的Promise
getDataFromApi().then(data => {
  // console.log("最终结果:", data);
  // console.log("测试：",data["海北"])
});

function dealRegionsOfRainfall(){
  console.log("============================降雨量判断=======================");
  // 获取海北州、西宁、海东市三个地区的降雨量
  var haiBeiRainFall = regionRainfall["海北"];
  var xiNingRainFall = regionRainfall["西宁"];
  var haiDongRainFall = regionRainfall["海东"];
  console.log("三地区的降雨量记录：海北，",haiBeiRainFall," 西宁,",xiNingRainFall," 海东 ,",haiDongRainFall)

  var offset
  // 写一个循环判断每个地区的最终风险预测情况
  for (let i = 0; i < regions.data.length; i++) {
    offset = regions.data[i].serial_number   //  获取序列数
    var regionName = regions.data[0].administrative_area.slice(0, 2);  // 获取地区的名称--到市级
    // 1. 先判断地区
      // 1.1 海东地区判断
    if ("海东" === regionName){
        // 1.1.1 极高风险判断
      if (regions.data[i].safety_risk_level === "极高风险" ){
        if (parseFloat(haiDongRainFall) >= 10.0 ){
          regions.data[i].final_risk = "4"  // 4 表示极高风险地区
        }else{
          regions.data[i].final_risk = "3"
        }
      }
        // 1.1.2 高度风险判断
      if (regions.data[i].safety_risk_level === "高度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "2"  // 高风险区域降雨量小于5mm时，最终的风险等级是中风险  2

        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "3"  // (5,15]  -- 高风险   3
        }else {
          regions.data[i].final_risk = "4"  // (15,无穷大]  -- 极高风险   3
        }
      }
        // 1.1.3 中度风险判断
      if (regions.data[i].safety_risk_level === "中度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "1"  // 中风险区域降雨量小于5mm时，最终的风险等级是低风险  1
        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "2"  // (5,15]  -- 中风险   1
        }else {
          regions.data[i].final_risk = "3"  // (15,无穷大]  -- 高风险   1
        }
      }
        // 1.1.4 低度风险判断
      if (regions.data[i].safety_risk_level === "低度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "0"  // 低风险区域降雨量小于5mm时，最终的风险等级是无风险  0

        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "1"  // (5,15]  -- 低风险   1
        }else {
          regions.data[i].final_risk = "2"  // (15,无穷大]  -- 中风险   1
        }


      }
    }
      // 1.2 西宁地区判断
    if ("西宁" === regionName){
      // 1.2.1 极高风险判断
      if (regions.data[i].safety_risk_level === "极高风险" ){
        if (parseFloat(haiDongRainFall) >= 10.0 ){
          regions.data[i].final_risk = "4"  // 4 表示极高风险地区
        }else{
          regions.data[i].final_risk = "3"
        }
      }
      // 1.2.2 高度风险判断
      if (regions.data[i].safety_risk_level === "高度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "2"  // 高风险区域降雨量小于5mm时，最终的风险等级是中风险  2

        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "3"  // (5,15]  -- 高风险   3
        }else {
          regions.data[i].final_risk = "4"  // (15,无穷大]  -- 极高风险   3
        }
      }
      // 1.2.3 中度风险判断
      if (regions.data[i].safety_risk_level === "中度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "1"  // 中风险区域降雨量小于5mm时，最终的风险等级是低风险  1
        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "2"  // (5,15]  -- 中风险   1
        }else {
          regions.data[i].final_risk = "3"  // (15,无穷大]  -- 高风险   1
        }
      }
      // 1.2.4 低度风险判断
      if (regions.data[i].safety_risk_level === "低度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "0"  // 低风险区域降雨量小于5mm时，最终的风险等级是无风险  0

        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "1"  // (5,15]  -- 低风险   1
        }else {
          regions.data[i].final_risk = "2"  // (15,无穷大]  -- 中风险   1
        }


      }
    }
      // 1.3 海北州地区判断
    if ("海北" === regionName){
      // 1.3.1 极高风险判断
      if (regions.data[i].safety_risk_level === "极高风险" ){
        if (parseFloat(haiDongRainFall) >= 10.0 ){
          regions.data[i].final_risk = "4"  // 4 表示极高风险地区
        }else{
          regions.data[i].final_risk = "3"
        }
      }
      // 1.3.2 高度风险判断
      if (regions.data[i].safety_risk_level === "高度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "2"  // 高风险区域降雨量小于5mm时，最终的风险等级是中风险  2

        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "3"  // (5,15]  -- 高风险   3
        }else {
          regions.data[i].final_risk = "4"  // (15,无穷大]  -- 极高风险   3
        }
      }
      // 1.3.3 中度风险判断
      if (regions.data[i].safety_risk_level === "中度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "1"  // 中风险区域降雨量小于5mm时，最终的风险等级是低风险  1
        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "2"  // (5,15]  -- 中风险   1
        }else {
          regions.data[i].final_risk = "3"  // (15,无穷大]  -- 高风险   1
        }
      }
      // 1.3.4 低度风险判断
      if (regions.data[i].safety_risk_level === "低度风险"){
        if (parseFloat(haiDongRainFall) <= 5.0){
          regions.data[i].final_risk = "0"  // 低风险区域降雨量小于5mm时，最终的风险等级是无风险  0

        }else if (parseFloat(haiDongRainFall) >5.0 && parseFloat(haiDongRainFall) <= 15){
          regions.data[i].final_risk = "1"  // (5,15]  -- 低风险   1
        }else {
          regions.data[i].final_risk = "2"  // (15,无穷大]  -- 中风险   1
        }


      }
    }
  }

}

  console.log("处理后的地区数据：",regions.data)
  console.log("============================降雨量判断=======================")

setTimeout(dealRegionsOfRainfall, 2000); // 通过添加延迟操作在axios完全发生完成后，在判断雨量数据
export default regions

