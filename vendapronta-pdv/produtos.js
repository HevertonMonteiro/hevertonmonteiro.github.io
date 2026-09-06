/* Gerado a partir de TABELA DE PRODUTOS.xlsx — campos: EAN, Código, Descrição, Indústria, Preço Final + ST */
/* Demo de portfólio: EAN, preços e nomes de indústria são fictícios. */
const PRODUCTS = [
  {
    "ean": "2000000000000",
    "codigo": "K1321",
    "name": "ACETILCISTEINA 600MG+VIT C+D3+ZIN 16CAPS",
    "lab": "VITALIS",
    "price": 15.29
  },
  {
    "ean": "2000000000001",
    "codigo": "K1401",
    "name": "ACETILCISTEINA 600MGX5G 16 SACHES",
    "lab": "VITALIS",
    "price": 10.95
  },
  {
    "ean": "2000000000002",
    "codigo": "M9483",
    "name": "ACETILCISTEINA DERMIX 200MG 16ENV",
    "lab": "DERMIX",
    "price": 13.03
  },
  {
    "ean": "2000000000003",
    "codigo": "M9482",
    "name": "ACETILCISTEINA DERMIX 600MG 16ENV",
    "lab": "DERMIX",
    "price": 9.24
  },
  {
    "ean": "2000000000004",
    "codigo": "M9934",
    "name": "ACETILCISTEINA DERMIX AD 120ML",
    "lab": "DERMIX",
    "price": 10.69
  },
  {
    "ean": "2000000000005",
    "codigo": "K1594",
    "name": "ACIDO FOLICO METILFOLATO + VIT 30CAPS",
    "lab": "VITALIS",
    "price": 13.93
  },
  {
    "ean": "2000000000006",
    "codigo": "K1592",
    "name": "ACIDO HIALURONICO 80MG + VIT 60CAPS",
    "lab": "VITALIS",
    "price": 32.62
  },
  {
    "ean": "2000000000007",
    "codigo": "M7042",
    "name": "ACNOCLIN LE BLUE 200ML",
    "lab": "DERMIX",
    "price": 18.98
  },
  {
    "ean": "2000000000008",
    "codigo": "M6051",
    "name": "AGUA MICELAR LE BLUE 150ML",
    "lab": "DERMIX",
    "price": 5.55
  },
  {
    "ean": "2000000000009",
    "codigo": "M6125",
    "name": "ALCOOL GEL CONCARE C FLOW 100G",
    "lab": "DERMIX",
    "price": 6.02
  },
  {
    "ean": "2000000000010",
    "codigo": "M3277",
    "name": "ALCOOL GEL CONCARE C FLOW 400G",
    "lab": "DERMIX",
    "price": 9.47
  },
  {
    "ean": "2000000000011",
    "codigo": "M8785",
    "name": "ANTISSEPTICO CONCARE 30ML",
    "lab": "DERMIX",
    "price": 3.67
  },
  {
    "ean": "2000000000012",
    "codigo": "NWASPHK01",
    "name": "ASPIRADOR NASAL NOSEWASH - HELLO KITTY HELLO KITTY AND FRIENDS",
    "lab": "BABYCARE",
    "price": 18.77
  },
  {
    "ean": "2000000000013",
    "codigo": "NWASPSPM01",
    "name": "ASPIRADOR NASAL NOSEWASH - SPIDERMAN",
    "lab": "BABYCARE",
    "price": 26.55
  },
  {
    "ean": "2000000000014",
    "codigo": "NWASP01",
    "name": "ASPIRADOR NASAL NOSEWASH - URSO",
    "lab": "BABYCARE",
    "price": 12.07
  },
  {
    "ean": "2000000000015",
    "codigo": "K1418",
    "name": "B12 9,94MCG ULTRA 60 GELCAPS",
    "lab": "VITALIS",
    "price": 12.51
  },
  {
    "ean": "2000000000016",
    "codigo": "K1637",
    "name": "B12 MASTIG METIL DOSE MAX 60CPR",
    "lab": "VITALIS",
    "price": 23.21
  },
  {
    "ean": "2000000000017",
    "codigo": "K1640",
    "name": "B12 MASTIG METIL DOSE MAX 90CPR",
    "lab": "VITALIS",
    "price": 40.85
  },
  {
    "ean": "2000000000018",
    "codigo": "K1527",
    "name": "B12 METILCOBALAMINA DOSE MAXIMA 60CAPS",
    "lab": "VITALIS",
    "price": 20.98
  },
  {
    "ean": "2000000000019",
    "codigo": "K1350",
    "name": "BCAA SPORTS 120CAPS",
    "lab": "VITALIS",
    "price": 46.8
  },
  {
    "ean": "2000000000020",
    "codigo": "K1601",
    "name": "BETA-ALANINA 300MG 120CAPS",
    "lab": "VITALIS",
    "price": 26.77
  },
  {
    "ean": "2000000000021",
    "codigo": "K1602",
    "name": "BETA-ALANINA 300MG 60CAPS",
    "lab": "VITALIS",
    "price": 7.01
  },
  {
    "ean": "2000000000022",
    "codigo": "K1603",
    "name": "BETA-ALANINA PO 120G",
    "lab": "VITALIS",
    "price": 40.58
  },
  {
    "ean": "2000000000023",
    "codigo": "K1590",
    "name": "BETACAROTENO DOSE MAXIMO 30CAPS",
    "lab": "VITALIS",
    "price": 16.89
  },
  {
    "ean": "2000000000024",
    "codigo": "K1509",
    "name": "BIOTINA DOSE MAX 500MG 30CAPS",
    "lab": "VITALIS",
    "price": 9.23
  },
  {
    "ean": "2000000000025",
    "codigo": "K1376",
    "name": "BIOTINA DOSE MAX 500MG 60CAPS",
    "lab": "VITALIS",
    "price": 11.37
  },
  {
    "ean": "2000000000026",
    "codigo": "K1349",
    "name": "BORO + ZMA SPORTS 60CAPS",
    "lab": "VITALIS",
    "price": 22.68
  },
  {
    "ean": "2000000000027",
    "codigo": "K1413",
    "name": "CABELOS E UNHAS 60 CAPS",
    "lab": "VITALIS",
    "price": 22.89
  },
  {
    "ean": "2000000000028",
    "codigo": "K1434",
    "name": "CAFFEINE SPORTS 100MG 120CAPS",
    "lab": "VITALIS",
    "price": 17.49
  },
  {
    "ean": "2000000000029",
    "codigo": "K1322",
    "name": "CAFFEINE SPORTS 60CAPS",
    "lab": "VITALIS",
    "price": 26.28
  },
  {
    "ean": "2000000000030",
    "codigo": "K1215",
    "name": "CALCIGEL MDK 750MG 60CAPS",
    "lab": "VITALIS",
    "price": 36.87
  },
  {
    "ean": "2000000000031",
    "codigo": "K1480",
    "name": "CALCIGEL OSSO CCM+D3+K2 500MG 30CPR",
    "lab": "VITALIS",
    "price": 32.5
  },
  {
    "ean": "2000000000032",
    "codigo": "K1436",
    "name": "CALCIO + D3 + ZINCO 60CAPS",
    "lab": "VITALIS",
    "price": 19.7
  },
  {
    "ean": "2000000000033",
    "codigo": "K1598",
    "name": "CALCIO 1.2G + D3 + K2 60 CAPS",
    "lab": "VITALIS",
    "price": 13.73
  },
  {
    "ean": "2000000000034",
    "codigo": "K1597",
    "name": "CALCIO 500MG 60 CAPS",
    "lab": "VITALIS",
    "price": 8.65
  },
  {
    "ean": "2000000000035",
    "codigo": "K1374",
    "name": "CALCIO MDK 750MG 60CAPS",
    "lab": "VITALIS",
    "price": 17.08
  },
  {
    "ean": "2000000000036",
    "codigo": "M600671",
    "name": "CALCIOCON D3 200UI - C/60 - ZERO",
    "lab": "DERMIX",
    "price": 12.39
  },
  {
    "ean": "2000000000037",
    "codigo": "M2291",
    "name": "CALCIOCON MDK 60S DERMIX",
    "lab": "DERMIX",
    "price": 21.4
  },
  {
    "ean": "2000000000038",
    "codigo": "M11406",
    "name": "CANELA DE VELHO 120G LEBLUE",
    "lab": "DERMIX",
    "price": 9.45
  },
  {
    "ean": "2000000000039",
    "codigo": "M600864",
    "name": "CARTIDRES 30 DERMIX",
    "lab": "DERMIX",
    "price": 15.74
  },
  {
    "ean": "2000000000040",
    "codigo": "M14751",
    "name": "CARTIDRES 60 CAPSULAS",
    "lab": "DERMIX",
    "price": 23.06
  },
  {
    "ean": "2000000000041",
    "codigo": "M2286",
    "name": "CARTIDRES FLEX LIMÃO 30 SACHES",
    "lab": "DERMIX",
    "price": 37.1
  },
  {
    "ean": "2000000000042",
    "codigo": "K555555",
    "name": "CESTAO OMEGA 3 ULTRA TG C/24 UNDS",
    "lab": "VITALIS",
    "price": 1091.04
  },
  {
    "ean": "2000000000043",
    "codigo": "K1224",
    "name": "CICLOALIVE 1000MG 30CAPS",
    "lab": "VITALIS",
    "price": 44.75
  },
  {
    "ean": "2000000000044",
    "codigo": "K1324",
    "name": "CLORETO DE MAGNESIO 120CAPS",
    "lab": "VITALIS",
    "price": 25.78
  },
  {
    "ean": "2000000000045",
    "codigo": "K1325",
    "name": "CLORETO DE MAGNESIO 60CAPS",
    "lab": "VITALIS",
    "price": 22.6
  },
  {
    "ean": "2000000000046",
    "codigo": "K1518",
    "name": "COENZIMA Q10 100MG 30CAPS",
    "lab": "VITALIS",
    "price": 46.93
  },
  {
    "ean": "2000000000047",
    "codigo": "K1593",
    "name": "COENZIMA Q10 200MG 30CAPS",
    "lab": "VITALIS",
    "price": 70.04
  },
  {
    "ean": "2000000000048",
    "codigo": "K1468",
    "name": "COENZIMA Q10 50MG 30CAPS",
    "lab": "VITALIS",
    "price": 35.33
  },
  {
    "ean": "2000000000049",
    "codigo": "K1329",
    "name": "COENZIMA Q10 60CAPS",
    "lab": "VITALIS",
    "price": 38.33
  },
  {
    "ean": "2000000000050",
    "codigo": "K1338",
    "name": "COGMED 60CAPS",
    "lab": "VITALIS",
    "price": 67.11
  },
  {
    "ean": "2000000000051",
    "codigo": "K1475",
    "name": "COLAG VERISOL + VIT FRUT VER 240G",
    "lab": "VITALIS",
    "price": 43.79
  },
  {
    "ean": "2000000000052",
    "codigo": "M5485",
    "name": "COLAGENO C/ACIDO HIALUR 300G",
    "lab": "DERMIX",
    "price": 49.94
  },
  {
    "ean": "2000000000053",
    "codigo": "K1368",
    "name": "COLAGENO TIPO II 40MG 30CAPS",
    "lab": "VITALIS",
    "price": 37.61
  },
  {
    "ean": "2000000000054",
    "codigo": "K1369",
    "name": "COLAGENO TIPO II 40MG 90CAPS",
    "lab": "VITALIS",
    "price": 40.65
  },
  {
    "ean": "2000000000055",
    "codigo": "K1649",
    "name": "COLAGENO VERIS+HIALU MELA/COCO 30 SACHES",
    "lab": "VITALIS",
    "price": 82.53
  },
  {
    "ean": "2000000000056",
    "codigo": "K1650",
    "name": "COLAGENO VERIS+Q10 MELA/COCO 30 SACHES",
    "lab": "VITALIS",
    "price": 43.08
  },
  {
    "ean": "2000000000057",
    "codigo": "K1482",
    "name": "COLAGENO VERISOL + VITAMINAS 60CAPS",
    "lab": "VITALIS",
    "price": 36.38
  },
  {
    "ean": "2000000000058",
    "codigo": "M11452",
    "name": "COLAGENO VERISOL+ACIDO HIAL 30",
    "lab": "DERMIX",
    "price": 77.63
  },
  {
    "ean": "2000000000059",
    "codigo": "K1573",
    "name": "COLAGENO VERISOL+HIALU FRUT VER 30 SACHE",
    "lab": "VITALIS",
    "price": 82.42
  },
  {
    "ean": "2000000000060",
    "codigo": "K1574",
    "name": "COLAGENO VERISOL+HIALU LIMAO 30 SACHES",
    "lab": "VITALIS",
    "price": 104.71
  },
  {
    "ean": "2000000000061",
    "codigo": "K1576",
    "name": "COLAGENO VERISOL+HIALU MAR/CAM/CAP 30 SA",
    "lab": "VITALIS",
    "price": 63.31
  },
  {
    "ean": "2000000000062",
    "codigo": "K1575",
    "name": "COLAGENO VERISOL+HIALU PINK LIM 30 SACHE",
    "lab": "VITALIS",
    "price": 91.43
  },
  {
    "ean": "2000000000063",
    "codigo": "K1577",
    "name": "COLAGENO VERISOL+HIALU TANG 30 SACHES",
    "lab": "VITALIS",
    "price": 83.99
  },
  {
    "ean": "2000000000064",
    "codigo": "K1578",
    "name": "COLAGENO VERISOL+Q10 FRUT VER 30 SACHE",
    "lab": "VITALIS",
    "price": 82.93
  },
  {
    "ean": "2000000000065",
    "codigo": "K1579",
    "name": "COLAGENO VERISOL+Q10 LIMAO 30 SACHES",
    "lab": "VITALIS",
    "price": 73.81
  },
  {
    "ean": "2000000000066",
    "codigo": "K1581",
    "name": "COLAGENO VERISOL+Q10 MAR/CAM/CAP 30 SAC",
    "lab": "VITALIS",
    "price": 102.09
  },
  {
    "ean": "2000000000067",
    "codigo": "K1580",
    "name": "COLAGENO VERISOL+Q10 PINK LIM 30 SACHES",
    "lab": "VITALIS",
    "price": 109.81
  },
  {
    "ean": "2000000000068",
    "codigo": "K1582",
    "name": "COLAGENO VERISOL+Q10 TANG 30 SACHES",
    "lab": "VITALIS",
    "price": 75.13
  },
  {
    "ean": "2000000000069",
    "codigo": "K1568",
    "name": "COLAGENO VERISOL+VIT FRUT VER 30 SACHES",
    "lab": "VITALIS",
    "price": 79.82
  },
  {
    "ean": "2000000000070",
    "codigo": "K1474",
    "name": "COLAGENO VERISOL+VIT LIMAO 240G",
    "lab": "VITALIS",
    "price": 40.0
  },
  {
    "ean": "2000000000071",
    "codigo": "K1569",
    "name": "COLAGENO VERISOL+VIT LIMAO 30 SACHES",
    "lab": "VITALIS",
    "price": 82.28
  },
  {
    "ean": "2000000000072",
    "codigo": "K1586",
    "name": "COLAGENO VERISOL+VIT MAR/CAM/CAP 240G",
    "lab": "VITALIS",
    "price": 78.7
  },
  {
    "ean": "2000000000073",
    "codigo": "K1571",
    "name": "COLAGENO VERISOL+VIT MAR/CAM/CAP 30 SAC",
    "lab": "VITALIS",
    "price": 101.53
  },
  {
    "ean": "2000000000074",
    "codigo": "K1651",
    "name": "COLAGENO VERISOL+VIT MELA/COCO 240G",
    "lab": "VITALIS",
    "price": 90.23
  },
  {
    "ean": "2000000000075",
    "codigo": "K1648",
    "name": "COLAGENO VERISOL+VIT MELA/COCO 30 SACHES",
    "lab": "VITALIS",
    "price": 54.77
  },
  {
    "ean": "2000000000076",
    "codigo": "K1585",
    "name": "COLAGENO VERISOL+VIT PINK LIM 240G",
    "lab": "VITALIS",
    "price": 61.45
  },
  {
    "ean": "2000000000077",
    "codigo": "K1570",
    "name": "COLAGENO VERISOL+VIT PINK LIM 30 SACHES",
    "lab": "VITALIS",
    "price": 80.12
  },
  {
    "ean": "2000000000078",
    "codigo": "K1587",
    "name": "COLAGENO VERISOL+VIT TANG 240G",
    "lab": "VITALIS",
    "price": 37.48
  },
  {
    "ean": "2000000000079",
    "codigo": "K1572",
    "name": "COLAGENO VERISOL+VIT TANGERINA 30 SACHES",
    "lab": "VITALIS",
    "price": 66.46
  },
  {
    "ean": "2000000000080",
    "codigo": "K1442",
    "name": "COLOSTRO BOVINO 30CAPS",
    "lab": "VITALIS",
    "price": 35.64
  },
  {
    "ean": "2000000000081",
    "codigo": "M593",
    "name": "COMPLEXO B 100S CONLIFE",
    "lab": "DERMIX",
    "price": 7.22
  },
  {
    "ean": "2000000000082",
    "codigo": "K1433",
    "name": "COMPLEXO B 8 VITAMINAS 60 CAPS",
    "lab": "VITALIS",
    "price": 9.3
  },
  {
    "ean": "2000000000083",
    "codigo": "CRPC-HKY-U001",
    "name": "COMPRESSA REFRESCANTE - PEQUENOS CUIDADOS - HELLO KITTY AND FRIENDS",
    "lab": "BABYCARE",
    "price": 12.27
  },
  {
    "ean": "2000000000084",
    "codigo": "CRPC-SPM-U001",
    "name": "COMPRESSA REFRESCANTE - PEQUENOS CUIDADOS - SPIDEY AND HIS AMAZING FRIENDS",
    "lab": "BABYCARE",
    "price": 6.3
  },
  {
    "ean": "2000000000085",
    "codigo": "K1528",
    "name": "CONDRO K MOVE MSM+GLUC+COLAG+MAGN 60CAP",
    "lab": "VITALIS",
    "price": 35.85
  },
  {
    "ean": "2000000000086",
    "codigo": "K1589",
    "name": "CONDRO K MUSCULAR COLAG+HMB 286G LIMAO",
    "lab": "VITALIS",
    "price": 84.36
  },
  {
    "ean": "2000000000087",
    "codigo": "K1458",
    "name": "CONDRO-K COLAGENO TIPO II 30CAPS",
    "lab": "VITALIS",
    "price": 40.82
  },
  {
    "ean": "2000000000088",
    "codigo": "K1492",
    "name": "CONDRO-K COLAGENO TIPO II 90CAPS",
    "lab": "VITALIS",
    "price": 35.94
  },
  {
    "ean": "2000000000089",
    "codigo": "K1493",
    "name": "CONDRO-K COMP CAL+MAG+TIPOII+K2+D3 60CAP",
    "lab": "VITALIS",
    "price": 46.19
  },
  {
    "ean": "2000000000090",
    "codigo": "K1494",
    "name": "CONDRO-K HIALU+MSM+TIPO II+VITS 60CAPS",
    "lab": "VITALIS",
    "price": 56.58
  },
  {
    "ean": "2000000000091",
    "codigo": "K1469",
    "name": "CONDRO-K TIPOII+CURC FLEXFLAN 30CAPS",
    "lab": "VITALIS",
    "price": 53.42
  },
  {
    "ean": "2000000000092",
    "codigo": "K1495",
    "name": "CONDRO-K ULTRA 30CAPS",
    "lab": "VITALIS",
    "price": 44.27
  },
  {
    "ean": "2000000000093",
    "codigo": "K1511",
    "name": "CRANBERRY + BETA-GLUCANA IMUNO 30CAPS",
    "lab": "VITALIS",
    "price": 56.42
  },
  {
    "ean": "2000000000094",
    "codigo": "K1596",
    "name": "CRANBERRY + VITAMINA C 30 SACHES",
    "lab": "VITALIS",
    "price": 44.44
  },
  {
    "ean": "2000000000095",
    "codigo": "K1510",
    "name": "CRANBERRY 30CAPS",
    "lab": "VITALIS",
    "price": 24.62
  },
  {
    "ean": "2000000000096",
    "codigo": "K1327",
    "name": "CRANBERRY 60CAPS",
    "lab": "VITALIS",
    "price": 36.11
  },
  {
    "ean": "2000000000097",
    "codigo": "K1520",
    "name": "CRANBERRY EXTREME 30CAPS",
    "lab": "VITALIS",
    "price": 55.31
  },
  {
    "ean": "2000000000098",
    "codigo": "K1559",
    "name": "CREATINA + BETA ALANINA 15 SACHES LIMAO",
    "lab": "VITALIS",
    "price": 48.88
  },
  {
    "ean": "2000000000099",
    "codigo": "K1562",
    "name": "CREATINA + BETA ALANINA 30 SACHES LIMAO",
    "lab": "VITALIS",
    "price": 36.75
  },
  {
    "ean": "2000000000100",
    "codigo": "K1558",
    "name": "CREATINA + BIOTINA 15 SACHES LIMAO",
    "lab": "VITALIS",
    "price": 23.47
  },
  {
    "ean": "2000000000101",
    "codigo": "K1561",
    "name": "CREATINA + BIOTINA 30 SACHES LIMAO",
    "lab": "VITALIS",
    "price": 41.02
  },
  {
    "ean": "2000000000102",
    "codigo": "K1560",
    "name": "CREATINA + MAGNESIO 15 SACHES LIMAO",
    "lab": "VITALIS",
    "price": 25.32
  },
  {
    "ean": "2000000000103",
    "codigo": "K1563",
    "name": "CREATINA + MAGNESIO 30 SACHES LIMAO",
    "lab": "VITALIS",
    "price": 54.37
  },
  {
    "ean": "2000000000104",
    "codigo": "K1688",
    "name": "CREATINA 3G + COLAGENO TIPO II 30S LIMAO",
    "lab": "VITALIS",
    "price": 59.87
  },
  {
    "ean": "2000000000105",
    "codigo": "K1686",
    "name": "CREATINA 3G + Q10 100MG 30 SAC TANGERINA",
    "lab": "VITALIS",
    "price": 42.65
  },
  {
    "ean": "2000000000106",
    "codigo": "K1685",
    "name": "CREATINA CREAPURE 3G 30 SACHES",
    "lab": "VITALIS",
    "price": 52.17
  },
  {
    "ean": "2000000000107",
    "codigo": "K1512",
    "name": "CREATINA PURE MONOHIDRATADA 120G",
    "lab": "VITALIS",
    "price": 26.41
  },
  {
    "ean": "2000000000108",
    "codigo": "K1513",
    "name": "CREATINA PURE MONOHIDRATADA 240G",
    "lab": "VITALIS",
    "price": 55.98
  },
  {
    "ean": "2000000000109",
    "codigo": "M6676",
    "name": "CREME ARNICA 120G LE BLUE",
    "lab": "DERMIX",
    "price": 13.66
  },
  {
    "ean": "2000000000110",
    "codigo": "K1536",
    "name": "CURCUMA + MSM DOSE MAXIMA 60CAPS",
    "lab": "VITALIS",
    "price": 59.38
  },
  {
    "ean": "2000000000111",
    "codigo": "K1462",
    "name": "CURCUMA + PROPOLIS 30CAPS",
    "lab": "VITALIS",
    "price": 44.06
  },
  {
    "ean": "2000000000112",
    "codigo": "K1359",
    "name": "CURCUMA 30CAPS",
    "lab": "VITALIS",
    "price": 37.02
  },
  {
    "ean": "2000000000113",
    "codigo": "K1470",
    "name": "CURCUMA DOSE MAXIMA 30CAPS",
    "lab": "VITALIS",
    "price": 40.2
  },
  {
    "ean": "2000000000114",
    "codigo": "K1352",
    "name": "DILATAFLUX SPORTS 60CAPS",
    "lab": "VITALIS",
    "price": 36.93
  },
  {
    "ean": "2000000000115",
    "codigo": "K33333",
    "name": "DISPLAY - MAGNESIO 25UND VITALIS",
    "lab": "VITALIS",
    "price": 524.87
  },
  {
    "ean": "2000000000116",
    "codigo": "K7777",
    "name": "DISPLAY MAGNESIO C/25 UNDS C/ 60 CPS CADA",
    "lab": "VITALIS",
    "price": 1265.22
  },
  {
    "ean": "2000000000117",
    "codigo": "NWDLT04",
    "name": "DISPOSITIVO LAVAGEM NASAL NOSEWASH 10ML - LEÃO / TUBARÃO C/ 2",
    "lab": "BABYCARE",
    "price": 31.19
  },
  {
    "ean": "2000000000118",
    "codigo": "NWC01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - CACHORRO",
    "lab": "BABYCARE",
    "price": 25.76
  },
  {
    "ean": "2000000000119",
    "codigo": "NWGP01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - GALINHA PINTADINHA",
    "lab": "BABYCARE",
    "price": 24.37
  },
  {
    "ean": "2000000000120",
    "codigo": "NWGP02",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - GALINHA PINTADINHA / PINTINHO C/ 2",
    "lab": "BABYCARE",
    "price": 22.07
  },
  {
    "ean": "2000000000121",
    "codigo": "NWG01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - GATO",
    "lab": "BABYCARE",
    "price": 17.13
  },
  {
    "ean": "2000000000122",
    "codigo": "NWBT01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - KIT HERÓIS BATMAN",
    "lab": "BABYCARE",
    "price": 14.21
  },
  {
    "ean": "2000000000123",
    "codigo": "NWMM01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - KIT HERÓIS MULHER MARAVILHA",
    "lab": "BABYCARE",
    "price": 25.82
  },
  {
    "ean": "2000000000124",
    "codigo": "NWSM01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - KIT HERÓIS SUPERMAN",
    "lab": "BABYCARE",
    "price": 13.3
  },
  {
    "ean": "2000000000125",
    "codigo": "NWL01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - LEÃO",
    "lab": "BABYCARE",
    "price": 11.12
  },
  {
    "ean": "2000000000126",
    "codigo": "NWP01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - PATO",
    "lab": "BABYCARE",
    "price": 13.68
  },
  {
    "ean": "2000000000127",
    "codigo": "NWT01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - TUBARÃO",
    "lab": "BABYCARE",
    "price": 12.84
  },
  {
    "ean": "2000000000128",
    "codigo": "NWU01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 10ML - UNICORNIO",
    "lab": "BABYCARE",
    "price": 16.06
  },
  {
    "ean": "2000000000129",
    "codigo": "NWPC03",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 20ML - PATRULHA CANINA CHASE",
    "lab": "BABYCARE",
    "price": 11.97
  },
  {
    "ean": "2000000000130",
    "codigo": "NWPM03",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 20ML - PATRULHA CANINA MARSHALL",
    "lab": "BABYCARE",
    "price": 10.92
  },
  {
    "ean": "2000000000131",
    "codigo": "NWPS03",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH 20ML - PATRULHA CANINA SKYE",
    "lab": "BABYCARE",
    "price": 13.94
  },
  {
    "ean": "2000000000132",
    "codigo": "NWA01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH MAX 240ML - ADULTO E INFANTIL",
    "lab": "BABYCARE",
    "price": 14.16
  },
  {
    "ean": "2000000000133",
    "codigo": "NWD01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH MAX 240ML - DINOSSAURO",
    "lab": "BABYCARE",
    "price": 19.9
  },
  {
    "ean": "2000000000134",
    "codigo": "NWMHK02",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH MAX 240ML - HELLO KITTY HELLO KITTY AND FRIENDS",
    "lab": "BABYCARE",
    "price": 12.5
  },
  {
    "ean": "2000000000135",
    "codigo": "NWMPC02",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH MAX 240ML - PATRULHA CANINA",
    "lab": "BABYCARE",
    "price": 31.08
  },
  {
    "ean": "2000000000136",
    "codigo": "MWMSPM02",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH MAX 240ML - SPIDERMAN",
    "lab": "BABYCARE",
    "price": 25.38
  },
  {
    "ean": "2000000000137",
    "codigo": "NWU02",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL NOSEWASH MAX 240ML - UNICÓRNIO",
    "lab": "BABYCARE",
    "price": 15.19
  },
  {
    "ean": "2000000000138",
    "codigo": "DLN10HK01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL PEQUENOS CUIDADOS - HELLO KITTY AND FRIENDS",
    "lab": "BABYCARE",
    "price": 13.15
  },
  {
    "ean": "2000000000139",
    "codigo": "PCLRS01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL PEQUENOS CUIDADOS - LOONEY TUNES - ROSA",
    "lab": "BABYCARE",
    "price": 14.72
  },
  {
    "ean": "2000000000140",
    "codigo": "PCLVD01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL PEQUENOS CUIDADOS - LOONEY TUNES - VERDE",
    "lab": "BABYCARE",
    "price": 15.0
  },
  {
    "ean": "2000000000141",
    "codigo": "DLN10SPY01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL PEQUENOS CUIDADOS - SPIDEY AND HIS AMAZING FRIENDS",
    "lab": "BABYCARE",
    "price": 11.02
  },
  {
    "ean": "2000000000142",
    "codigo": "PCATG01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL PEQUENOS CUIDADOS - TARTARUGA",
    "lab": "BABYCARE",
    "price": 22.99
  },
  {
    "ean": "2000000000143",
    "codigo": "DLN10SF01",
    "name": "DISPOSITIVO P/ LAVAGEM NASAL SUPER FRIENDS",
    "lab": "BABYCARE",
    "price": 25.37
  },
  {
    "ean": "2000000000144",
    "codigo": "NWHK01",
    "name": "DISPOSITIVO P/LAVAGEM NASAL NOSEWASH 10ML - HELLO KITTY AND FRIENDS",
    "lab": "BABYCARE",
    "price": 19.24
  },
  {
    "ean": "2000000000145",
    "codigo": "NWSPM01",
    "name": "DISPOSITIVO P/LAVAGEM NASAL NOSEWASH 10ML - SPIDERMAN",
    "lab": "BABYCARE",
    "price": 19.58
  },
  {
    "ean": "2000000000146",
    "codigo": "NWPS240-KU",
    "name": "DISPOSITIVO P/LAVAGEM NASAL NOSEWASH MAX PROTECT SENSE 240ML",
    "lab": "BABYCARE",
    "price": 13.05
  },
  {
    "ean": "2000000000147",
    "codigo": "NWPSAZ01",
    "name": "DISPOSITIVO P/LAVAGEM NASAL NOSEWASH PROTECT SENSE 10MmL - URSO AZUL",
    "lab": "BABYCARE",
    "price": 12.89
  },
  {
    "ean": "2000000000148",
    "codigo": "NWPSRS01",
    "name": "DISPOSITIVO P/LAVAGEM NASAL NOSEWASH PROTECT SENSE 10MmL - URSO ROSA",
    "lab": "BABYCARE",
    "price": 17.67
  },
  {
    "ean": "2000000000149",
    "codigo": "NWPSVD01",
    "name": "DISPOSITIVO P/LAVAGEM NASAL NOSEWASH PROTECT SENSE 10MmL - URSO VERDE",
    "lab": "BABYCARE",
    "price": 16.12
  },
  {
    "ean": "2000000000150",
    "codigo": "K1217",
    "name": "DORIDADE 60CAPS",
    "lab": "VITALIS",
    "price": 54.66
  },
  {
    "ean": "2000000000151",
    "codigo": "PCEIA02",
    "name": "ESPACADOR PEQUENOS CUIDADOS - ADULTO / INFANTIL",
    "lab": "BABYCARE",
    "price": 16.71
  },
  {
    "ean": "2000000000152",
    "codigo": "PCGGB02",
    "name": "ESPACADOR PEQUENOS CUIDADOS - BABY - GALINHA PINTADINHA",
    "lab": "BABYCARE",
    "price": 13.94
  },
  {
    "ean": "2000000000153",
    "codigo": "PCPTK02",
    "name": "ESPACADOR PEQUENOS CUIDADOS - KIDS - PATRULHA CANINA",
    "lab": "BABYCARE",
    "price": 36.69
  },
  {
    "ean": "2000000000154",
    "codigo": "K1626",
    "name": "FAST PURE B12 DOSE MAXIMA 20ML",
    "lab": "VITALIS",
    "price": 18.7
  },
  {
    "ean": "2000000000155",
    "codigo": "K1629",
    "name": "FAST PURE BIOTINA DOSE MAXIMA 20ML",
    "lab": "VITALIS",
    "price": 12.02
  },
  {
    "ean": "2000000000156",
    "codigo": "K1627",
    "name": "FAST PURE CROMO DOSE MAX 20ML",
    "lab": "VITALIS",
    "price": 18.91
  },
  {
    "ean": "2000000000157",
    "codigo": "K1632",
    "name": "FAST PURE K2 + D3 DOSE MAXIMA 20ML",
    "lab": "VITALIS",
    "price": 9.94
  },
  {
    "ean": "2000000000158",
    "codigo": "K1628",
    "name": "FAST PURE MELATONINA + B6 20ML",
    "lab": "VITALIS",
    "price": 18.65
  },
  {
    "ean": "2000000000159",
    "codigo": "CRFFD10",
    "name": "FEVER FRESH COMPRESSA REFRESCANTE - CAIXA COM 10 PACOTES COM 2 UNID. CADA",
    "lab": "BABYCARE",
    "price": 128.91
  },
  {
    "ean": "2000000000160",
    "codigo": "CRFFU01",
    "name": "FEVER FRESH COMPRESSA REFRESCANTE - PACOTES COM 2 UNID. CADA",
    "lab": "BABYCARE",
    "price": 12.24
  },
  {
    "ean": "2000000000161",
    "codigo": "K1612",
    "name": "FLORATOX FIBRAS 240GRSABOR LARANJA",
    "lab": "VITALIS",
    "price": 55.48
  },
  {
    "ean": "2000000000162",
    "codigo": "K1497",
    "name": "FLORATOX FOS FRUTOOLIGOSSACARIDEOS 225G",
    "lab": "VITALIS",
    "price": 35.05
  },
  {
    "ean": "2000000000163",
    "codigo": "K1556",
    "name": "FLORATOX PSYLLIUM 12 SACHES LARANJA",
    "lab": "VITALIS",
    "price": 22.54
  },
  {
    "ean": "2000000000164",
    "codigo": "K1611",
    "name": "FLORATOX PSYLLIUM 180G SABOR LARANJA",
    "lab": "VITALIS",
    "price": 42.12
  },
  {
    "ean": "2000000000165",
    "codigo": "K1557",
    "name": "FLORATOX PSYLLIUM 30 SACHES LARANJA",
    "lab": "VITALIS",
    "price": 44.26
  },
  {
    "ean": "2000000000166",
    "codigo": "K1499",
    "name": "FORTEGESTAN COMPLETO 60CAPS",
    "lab": "VITALIS",
    "price": 25.44
  },
  {
    "ean": "2000000000167",
    "codigo": "M9678",
    "name": "GEL LUBRIF CONSEX 50G",
    "lab": "DERMIX",
    "price": 9.98
  },
  {
    "ean": "2000000000168",
    "codigo": "K1604",
    "name": "GLUTAMINA 150G",
    "lab": "VITALIS",
    "price": 43.91
  },
  {
    "ean": "2000000000169",
    "codigo": "K1605",
    "name": "GLUTAMINA 300G",
    "lab": "VITALIS",
    "price": 55.39
  },
  {
    "ean": "2000000000170",
    "codigo": "K1332",
    "name": "GUARANA 60CAPS",
    "lab": "VITALIS",
    "price": 29.45
  },
  {
    "ean": "2000000000171",
    "codigo": "K1472",
    "name": "IODO 200% IDR 30CAPS",
    "lab": "VITALIS",
    "price": 23.37
  },
  {
    "ean": "2000000000172",
    "codigo": "K1417",
    "name": "K2 100%IDR 120MCG 30 GELCAPS",
    "lab": "VITALIS",
    "price": 35.06
  },
  {
    "ean": "2000000000173",
    "codigo": "K1415",
    "name": "K2 149MCG + D3 2000UI MAX 30 GELCAPS",
    "lab": "VITALIS",
    "price": 37.76
  },
  {
    "ean": "2000000000174",
    "codigo": "K1416",
    "name": "K2 149MCG PLUS 30 GELCAPS",
    "lab": "VITALIS",
    "price": 29.99
  },
  {
    "ean": "2000000000175",
    "codigo": "M6654",
    "name": "LACTUFOR AMEIXA 120ML CONLIFE",
    "lab": "DERMIX",
    "price": 12.58
  },
  {
    "ean": "2000000000176",
    "codigo": "M6652",
    "name": "LACTUFOR MAMAO 120ML CONLIFE",
    "lab": "DERMIX",
    "price": 7.56
  },
  {
    "ean": "2000000000177",
    "codigo": "M202606",
    "name": "LACTUON 120ML SABOR AMEIXA",
    "lab": "DERMIX",
    "price": 10.51
  },
  {
    "ean": "2000000000178",
    "codigo": "M202607",
    "name": "LACTUON 120ML SABOR MAMÃO PAPAIA",
    "lab": "DERMIX",
    "price": 8.91
  },
  {
    "ean": "2000000000179",
    "codigo": "K1330",
    "name": "LARANJA MORO 60 CAPS",
    "lab": "VITALIS",
    "price": 20.16
  },
  {
    "ean": "2000000000180",
    "codigo": "M14085",
    "name": "LEITE DE MAGNESIA DERMIX HORTELA 120ML",
    "lab": "DERMIX",
    "price": 2.83
  },
  {
    "ean": "2000000000181",
    "codigo": "M14078",
    "name": "LEITE DE MAGNESIA DERMIX HORTELA 350ML",
    "lab": "DERMIX",
    "price": 10.97
  },
  {
    "ean": "2000000000182",
    "codigo": "M14090",
    "name": "LEITE DE MAGNESIA DERMIX TRADICIONAL 120ML",
    "lab": "DERMIX",
    "price": 3.97
  },
  {
    "ean": "2000000000183",
    "codigo": "M14057",
    "name": "LEITE DE MAGNESIA DERMIX TRADICIONAL 350ML",
    "lab": "DERMIX",
    "price": 16.46
  },
  {
    "ean": "2000000000184",
    "codigo": "NW-LN01",
    "name": "LENÇO NASAL NOSEWASH COM SORO FISIOLÓGICO - PACOTE COM 20 LENÇOS",
    "lab": "BABYCARE",
    "price": 13.2
  },
  {
    "ean": "2000000000185",
    "codigo": "BB-LR01",
    "name": "LENÇO REPELENTE COM IR3535 BUG BOOM - PACOTE COM 16 LENÇOS",
    "lab": "BABYCARE",
    "price": 20.64
  },
  {
    "ean": "2000000000186",
    "codigo": "K1221",
    "name": "LIBIDELA 500MG 30CAPS",
    "lab": "VITALIS",
    "price": 63.78
  },
  {
    "ean": "2000000000187",
    "codigo": "K1341",
    "name": "LICOPENO DE TOMATE + SELENIO 60CAPS",
    "lab": "VITALIS",
    "price": 50.93
  },
  {
    "ean": "2000000000188",
    "codigo": "K1342",
    "name": "LICOPENO MAX 60CAPS",
    "lab": "VITALIS",
    "price": 66.33
  },
  {
    "ean": "2000000000189",
    "codigo": "K1220",
    "name": "LIPOSALINA 500MG 60CAPS",
    "lab": "VITALIS",
    "price": 27.96
  },
  {
    "ean": "2000000000190",
    "codigo": "K1621",
    "name": "LIPOSALINA FIBRAS +ACIDO CLO. 240G LIM",
    "lab": "VITALIS",
    "price": 19.14
  },
  {
    "ean": "2000000000191",
    "codigo": "K1622",
    "name": "LIPOSALINA FIBRAS +ACIDO CLO. 30SAC LIM",
    "lab": "VITALIS",
    "price": 32.26
  },
  {
    "ean": "2000000000192",
    "codigo": "K1595",
    "name": "LUTEINA + ASTA + ZEAN + VITAMINAS 60CAPS",
    "lab": "VITALIS",
    "price": 20.97
  },
  {
    "ean": "2000000000193",
    "codigo": "K1646",
    "name": "MACA PERUANA 300MG",
    "lab": "VITALIS",
    "price": 35.68
  },
  {
    "ean": "2000000000194",
    "codigo": "K2026",
    "name": "MACA PERUANA CAPPUCCINO 150G",
    "lab": "VITALIS",
    "price": 43.61
  },
  {
    "ean": "2000000000195",
    "codigo": "K1777",
    "name": "MACA PERUANA CAPPUCCINO 300G",
    "lab": "VITALIS",
    "price": 77.91
  },
  {
    "ean": "2000000000196",
    "codigo": "K1531",
    "name": "MAGNESIO 5 DOSE MAXIMA 60CAPS",
    "lab": "VITALIS",
    "price": 51.82
  },
  {
    "ean": "2000000000197",
    "codigo": "M600436",
    "name": "MAGNESIO BISGLICINATO C/60 CPS GELATINOSAS",
    "lab": "DERMIX",
    "price": 17.46
  },
  {
    "ean": "2000000000198",
    "codigo": "K1533",
    "name": "MAGNESIO DIMALATO + CURCUMA 210MG 60CAPS",
    "lab": "VITALIS",
    "price": 43.49
  },
  {
    "ean": "2000000000199",
    "codigo": "K1529",
    "name": "MAGNESIO DIMALATO + D3 + K2 60CAPS",
    "lab": "VITALIS",
    "price": 48.81
  },
  {
    "ean": "2000000000200",
    "codigo": "K1420",
    "name": "MAGNESIO DIMALATO 210MG 60CAPS",
    "lab": "VITALIS",
    "price": 18.75
  },
  {
    "ean": "2000000000201",
    "codigo": "K1435",
    "name": "MAGNESIO DIMALATO 60CAPS",
    "lab": "VITALIS",
    "price": 35.41
  },
  {
    "ean": "2000000000202",
    "codigo": "K1588",
    "name": "MAGNESIO PREBIOTICO 300G SABOR LIMAO",
    "lab": "VITALIS",
    "price": 101.49
  },
  {
    "ean": "2000000000203",
    "codigo": "K1534",
    "name": "MAGNESIO QUELATO 210MG 60CAPS",
    "lab": "VITALIS",
    "price": 48.18
  },
  {
    "ean": "2000000000204",
    "codigo": "K1544",
    "name": "MAGNESIO QUELATO 210MG+TRIP+MELAT 60CAPS",
    "lab": "VITALIS",
    "price": 47.02
  },
  {
    "ean": "2000000000205",
    "codigo": "K1535",
    "name": "MAGNESIO TAURATO 84MG 60CAPS",
    "lab": "VITALIS",
    "price": 37.14
  },
  {
    "ean": "2000000000206",
    "codigo": "K1530",
    "name": "MAGNESIO TRIO MAL+QUELATO+TAURATO 60CAPS",
    "lab": "VITALIS",
    "price": 26.27
  },
  {
    "ean": "2000000000207",
    "codigo": "K1366",
    "name": "MAGNESIO TRIPLA FONTE 500MG 60CAPS",
    "lab": "VITALIS",
    "price": 39.64
  },
  {
    "ean": "2000000000208",
    "codigo": "K1620",
    "name": "MELAT LIPOSSOMADA+TRIPT 100MG+B6 120CAPS",
    "lab": "VITALIS",
    "price": 21.82
  },
  {
    "ean": "2000000000209",
    "codigo": "K1296",
    "name": "MELATONINA + B6 210MCG 120CAPS",
    "lab": "VITALIS",
    "price": 36.71
  },
  {
    "ean": "2000000000210",
    "codigo": "K1295",
    "name": "MELATONINA + B6 210MCG 60CAPS",
    "lab": "VITALIS",
    "price": 25.92
  },
  {
    "ean": "2000000000211",
    "codigo": "K1619",
    "name": "MELATONINA LIPOSSOMADA 210MCG+B6 120CAPS",
    "lab": "VITALIS",
    "price": 15.63
  },
  {
    "ean": "2000000000212",
    "codigo": "M9783",
    "name": "MELATONINA DERMIX 90 CAPS",
    "lab": "DERMIX",
    "price": 10.93
  },
  {
    "ean": "2000000000213",
    "codigo": "M9687",
    "name": "MELATONINA DERMIX GOTAS 20ML",
    "lab": "DERMIX",
    "price": 13.38
  },
  {
    "ean": "2000000000214",
    "codigo": "K1367",
    "name": "MELATONINA+TRIPTOFANO 60CAPS",
    "lab": "VITALIS",
    "price": 34.48
  },
  {
    "ean": "2000000000215",
    "codigo": "K1502",
    "name": "MEN 40 IMUNO COLOSTRO 30CAPS",
    "lab": "VITALIS",
    "price": 35.56
  },
  {
    "ean": "2000000000216",
    "codigo": "K1283",
    "name": "MEN 40 POTENCY 500MG 30CAPS",
    "lab": "VITALIS",
    "price": 24.46
  },
  {
    "ean": "2000000000217",
    "codigo": "K1282",
    "name": "MEN 40 PROTEC 640MG 60CAPS",
    "lab": "VITALIS",
    "price": 36.04
  },
  {
    "ean": "2000000000218",
    "codigo": "K1284",
    "name": "MEN 40 VIKING 600MG 30CAPS",
    "lab": "VITALIS",
    "price": 54.11
  },
  {
    "ean": "2000000000219",
    "codigo": "K1438",
    "name": "METILFOLATO + VITAMINAS 30CAPS",
    "lab": "VITALIS",
    "price": 24.81
  },
  {
    "ean": "2000000000220",
    "codigo": "K88888",
    "name": "MINI CESTAO OMEGA 3 ULTRA TG C/24 UNDS",
    "lab": "VITALIS",
    "price": 563.2
  },
  {
    "ean": "2000000000221",
    "codigo": "K1537",
    "name": "MSM DOSE MAXIMA 30CAPS",
    "lab": "VITALIS",
    "price": 25.66
  },
  {
    "ean": "2000000000222",
    "codigo": "K1147",
    "name": "OLEO DE ABACATE 1000MG 60CAPS",
    "lab": "VITALIS",
    "price": 62.4
  },
  {
    "ean": "2000000000223",
    "codigo": "K1360",
    "name": "OLEO DE ALHO 60CAPS",
    "lab": "VITALIS",
    "price": 24.32
  },
  {
    "ean": "2000000000224",
    "codigo": "K440",
    "name": "OLEO DE CARTAMO 1000MG 60CAPS",
    "lab": "VITALIS",
    "price": 26.56
  },
  {
    "ean": "2000000000225",
    "codigo": "K695",
    "name": "OLEO DE CHIA 1000MG 60CAPS",
    "lab": "VITALIS",
    "price": 37.9
  },
  {
    "ean": "2000000000226",
    "codigo": "K372",
    "name": "OLEO DE COCO 1000MG 60CAPS",
    "lab": "VITALIS",
    "price": 20.32
  },
  {
    "ean": "2000000000227",
    "codigo": "K432",
    "name": "OLEO DE LINHACA 1000MG 60CAPS",
    "lab": "VITALIS",
    "price": 15.45
  },
  {
    "ean": "2000000000228",
    "codigo": "K1353",
    "name": "OLEO DE PRIMULA 60CAPS",
    "lab": "VITALIS",
    "price": 48.81
  },
  {
    "ean": "2000000000229",
    "codigo": "K1403",
    "name": "OLEO DE SEM ABOBORA + VIT 500MG 60CAPS",
    "lab": "VITALIS",
    "price": 31.28
  },
  {
    "ean": "2000000000230",
    "codigo": "K1337",
    "name": "OLEO DE SEMENTE DE ABOBORA 1000G 120CAPS",
    "lab": "VITALIS",
    "price": 50.24
  },
  {
    "ean": "2000000000231",
    "codigo": "K456",
    "name": "OLEO DE SEMENTE DE ABOBORA 1000G 60CAPS",
    "lab": "VITALIS",
    "price": 50.42
  },
  {
    "ean": "2000000000232",
    "codigo": "M121178",
    "name": "OMEGA 3 1000MG DERMIX 60 CAPSULAS",
    "lab": "DERMIX",
    "price": 13.99
  },
  {
    "ean": "2000000000233",
    "codigo": "K995",
    "name": "OMEGA 3 6 9 1000MG 60CAPS",
    "lab": "VITALIS",
    "price": 49.5
  },
  {
    "ean": "2000000000234",
    "codigo": "K1566",
    "name": "OMEGA 3 ALGAS CONC 705DHA 200EPA 60CAPS",
    "lab": "VITALIS",
    "price": 74.84
  },
  {
    "ean": "2000000000235",
    "codigo": "K1680",
    "name": "OMEGA 3 ALGAS CONC 705DHA 200EPA 90CAPS",
    "lab": "VITALIS",
    "price": 53.95
  },
  {
    "ean": "2000000000236",
    "codigo": "K1690",
    "name": "OMEGA 3 ALGAS PLUS 1200DHA 350EPA 60CAPS",
    "lab": "VITALIS",
    "price": 53.38
  },
  {
    "ean": "2000000000237",
    "codigo": "K1664",
    "name": "OMEGA 3 ALGAS PLUS 1200DHA 350EPA 90CAPS",
    "lab": "VITALIS",
    "price": 112.4
  },
  {
    "ean": "2000000000238",
    "codigo": "M600442",
    "name": "OMEGA 3 CONCENTRADO DERMIX 30 CAPSULAS",
    "lab": "DERMIX",
    "price": 16.91
  },
  {
    "ean": "2000000000239",
    "codigo": "K1625",
    "name": "OMEGA 3 KIDS 60 PEIXINHOS",
    "lab": "VITALIS",
    "price": 45.43
  },
  {
    "ean": "2000000000240",
    "codigo": "K1320",
    "name": "OMEGA 3 TRIPLA FONTE 1000MG 120CAPS",
    "lab": "VITALIS",
    "price": 17.25
  },
  {
    "ean": "2000000000241",
    "codigo": "K1340",
    "name": "OMEGA 3 TRIPLA FONTE 1000MG 180CAPS",
    "lab": "VITALIS",
    "price": 39.42
  },
  {
    "ean": "2000000000242",
    "codigo": "K1339",
    "name": "OMEGA 3 TRIPLA FONTE 1000MG 240CAPS",
    "lab": "VITALIS",
    "price": 31.2
  },
  {
    "ean": "2000000000243",
    "codigo": "K1319",
    "name": "OMEGA 3 TRIPLA FONTE 1000MG 60CAPS",
    "lab": "VITALIS",
    "price": 20.8
  },
  {
    "ean": "2000000000244",
    "codigo": "K1655",
    "name": "OMEGA 3 ULTRA TG - 1.000MG 120 CAPS",
    "lab": "VITALIS",
    "price": 34.91
  },
  {
    "ean": "2000000000245",
    "codigo": "K1683",
    "name": "OMEGA 3 ULTRA TG - 1.000MG 180 CAPS",
    "lab": "VITALIS",
    "price": 57.4
  },
  {
    "ean": "2000000000246",
    "codigo": "K1684",
    "name": "OMEGA 3 ULTRA TG - 1.000MG 240 CAPS",
    "lab": "VITALIS",
    "price": 86.28
  },
  {
    "ean": "2000000000247",
    "codigo": "K1654",
    "name": "OMEGA 3 ULTRA TG - 1.000MG 60 CAPS",
    "lab": "VITALIS",
    "price": 38.11
  },
  {
    "ean": "2000000000248",
    "codigo": "K1395",
    "name": "OMEGA3 540EPA 360DHA 120CAPS MEG3",
    "lab": "VITALIS",
    "price": 44.62
  },
  {
    "ean": "2000000000249",
    "codigo": "K1457",
    "name": "OMEGA3 540EPA 360DHA 240CAPS MEG3",
    "lab": "VITALIS",
    "price": 122.5
  },
  {
    "ean": "2000000000250",
    "codigo": "K1455",
    "name": "OMEGA3 632MG 540EPA 360DHA 60CAPS MEG3",
    "lab": "VITALIS",
    "price": 27.82
  },
  {
    "ean": "2000000000251",
    "codigo": "K1503",
    "name": "OMEGA3 CONC MEG3 540/360+ VIT. E 60CAPS",
    "lab": "VITALIS",
    "price": 48.77
  },
  {
    "ean": "2000000000252",
    "codigo": "K1504",
    "name": "OMEGA3 CONC MEG3 540/360+CURC 130MG 60CA",
    "lab": "VITALIS",
    "price": 59.96
  },
  {
    "ean": "2000000000253",
    "codigo": "K1507",
    "name": "OMEGA3 CONC MEG3 540/360+TIPOII 60CAPS",
    "lab": "VITALIS",
    "price": 31.64
  },
  {
    "ean": "2000000000254",
    "codigo": "K1505",
    "name": "OMEGA3 CONC MEG3 540/360+VIT E+Q10 60CAP",
    "lab": "VITALIS",
    "price": 55.28
  },
  {
    "ean": "2000000000255",
    "codigo": "K1652",
    "name": "OMEGA3 CONC MEG3 MEMORY 260/660 60CAPS",
    "lab": "VITALIS",
    "price": 40.74
  },
  {
    "ean": "2000000000256",
    "codigo": "K1506",
    "name": "OMEGA3 CONC MG3 540/360 AST+LUT+ZEA 60CA",
    "lab": "VITALIS",
    "price": 30.81
  },
  {
    "ean": "2000000000257",
    "codigo": "K1653",
    "name": "OMEGA3 PLUS CONC 1.5G EPA/DHA+VITE 90CAP",
    "lab": "VITALIS",
    "price": 94.1
  },
  {
    "ean": "2000000000258",
    "codigo": "MG0001",
    "name": "PARACETAMOL 200MG/ML GOTAS 15 ML",
    "lab": "DERMIX",
    "price": 4.84
  },
  {
    "ean": "2000000000259",
    "codigo": "M0012",
    "name": "PARACETAMOL 200MG/ML GTS 15ML",
    "lab": "DERMIX",
    "price": 3.21
  },
  {
    "ean": "2000000000260",
    "codigo": "M0011",
    "name": "PARACETAMOL 500MG C/20",
    "lab": "DERMIX",
    "price": 4.84
  },
  {
    "ean": "2000000000261",
    "codigo": "MG0002",
    "name": "PARACETAMOL 750 MG C/20 CPR",
    "lab": "DERMIX",
    "price": 3.82
  },
  {
    "ean": "2000000000262",
    "codigo": "M0010",
    "name": "PARACETAMOL 750MG C/20",
    "lab": "DERMIX",
    "price": 3.63
  },
  {
    "ean": "2000000000263",
    "codigo": "M6673",
    "name": "PASTA D AGUA CONCARE 80G",
    "lab": "DERMIX",
    "price": 8.46
  },
  {
    "ean": "2000000000264",
    "codigo": "K1336",
    "name": "PICOLINATO DE CROMO 30CAPS",
    "lab": "VITALIS",
    "price": 21.84
  },
  {
    "ean": "2000000000265",
    "codigo": "K1517",
    "name": "PINUS PINASTER 50MG 30CPR",
    "lab": "VITALIS",
    "price": 26.78
  },
  {
    "ean": "2000000000266",
    "codigo": "K1516",
    "name": "PINUS PINASTER 50MG 60CPR",
    "lab": "VITALIS",
    "price": 58.36
  },
  {
    "ean": "2000000000267",
    "codigo": "K587",
    "name": "PRIMULA MAX 1000MG 60CAPS",
    "lab": "VITALIS",
    "price": 35.05
  },
  {
    "ean": "2000000000268",
    "codigo": "K1371",
    "name": "PROPOLIS VERDE 30CAPS",
    "lab": "VITALIS",
    "price": 19.1
  },
  {
    "ean": "2000000000269",
    "codigo": "M8896",
    "name": "REPELENTE ON 100ML LOCAO",
    "lab": "DERMIX",
    "price": 15.35
  },
  {
    "ean": "2000000000270",
    "codigo": "M8895",
    "name": "REPELENTE ON 100ML SPRAY",
    "lab": "DERMIX",
    "price": 12.27
  },
  {
    "ean": "2000000000271",
    "codigo": "M11420",
    "name": "REPELENTE ON 120ML LOCAO KIDS",
    "lab": "DERMIX",
    "price": 15.82
  },
  {
    "ean": "2000000000272",
    "codigo": "M0008",
    "name": "SHAMPOO CETOCONAZOL CONCARE 100 ML",
    "lab": "DERMIX",
    "price": 11.47
  },
  {
    "ean": "2000000000273",
    "codigo": "M0009",
    "name": "SIMETICONA 125 MG C/10 CAPS MOLES",
    "lab": "DERMIX",
    "price": 4.47
  },
  {
    "ean": "2000000000274",
    "codigo": "M0013",
    "name": "SIMETICONA 75MG GTS (15ML)",
    "lab": "DERMIX",
    "price": 2.39
  },
  {
    "ean": "2000000000275",
    "codigo": "K1372",
    "name": "SKIN HAIR & NAILS 500MG 60CAPS",
    "lab": "VITALIS",
    "price": 17.29
  },
  {
    "ean": "2000000000276",
    "codigo": "M8782",
    "name": "SPRAY CONCARE ANTISSEPTIC 45ML",
    "lab": "DERMIX",
    "price": 6.35
  },
  {
    "ean": "2000000000277",
    "codigo": "K1444",
    "name": "STD B12 30CAPS",
    "lab": "VITALIS",
    "price": 13.37
  },
  {
    "ean": "2000000000278",
    "codigo": "K1445",
    "name": "STD BIOTINA 30CAPS",
    "lab": "VITALIS",
    "price": 15.65
  },
  {
    "ean": "2000000000279",
    "codigo": "K1449",
    "name": "STD ENERGIA + VITAMINAS 30CAPS",
    "lab": "VITALIS",
    "price": 12.61
  },
  {
    "ean": "2000000000280",
    "codigo": "K1448",
    "name": "STD MELATONINA 210 DERMIX 30CAPS",
    "lab": "VITALIS",
    "price": 13.63
  },
  {
    "ean": "2000000000281",
    "codigo": "K1552",
    "name": "STD MULTIVITAMINICO A Z 30CAPS",
    "lab": "VITALIS",
    "price": 12.94
  },
  {
    "ean": "2000000000282",
    "codigo": "K1567",
    "name": "STD MULTIVITAMINICO GESTANTE 30CAPS",
    "lab": "VITALIS",
    "price": 18.79
  },
  {
    "ean": "2000000000283",
    "codigo": "K1554",
    "name": "STD MULTIVITAMINICO HOMEM 30CAPS",
    "lab": "VITALIS",
    "price": 15.73
  },
  {
    "ean": "2000000000284",
    "codigo": "K1555",
    "name": "STD MULTIVITAMINICO MULHER 30CAPS",
    "lab": "VITALIS",
    "price": 17.97
  },
  {
    "ean": "2000000000285",
    "codigo": "K1553",
    "name": "STD MULTIVITAMINICO SENIOR 30CAPS",
    "lab": "VITALIS",
    "price": 18.8
  },
  {
    "ean": "2000000000286",
    "codigo": "K1452",
    "name": "STD PICOLINATO DE CROMO 30CAPS",
    "lab": "VITALIS",
    "price": 10.17
  },
  {
    "ean": "2000000000287",
    "codigo": "K1453",
    "name": "STD SULFATO FERROSO 30CAPS",
    "lab": "VITALIS",
    "price": 13.97
  },
  {
    "ean": "2000000000288",
    "codigo": "K1447",
    "name": "STD VITAMINA E 15MG 30CAPS",
    "lab": "VITALIS",
    "price": 18.82
  },
  {
    "ean": "2000000000289",
    "codigo": "K1113",
    "name": "TRI COL. VERIS+TIPOII+HIDR 275G LIMAO",
    "lab": "VITALIS",
    "price": 145.95
  },
  {
    "ean": "2000000000290",
    "codigo": "K1114",
    "name": "TRI COL. VERIS+TIPOII+HIDR 275G NATURAL",
    "lab": "VITALIS",
    "price": 71.91
  },
  {
    "ean": "2000000000291",
    "codigo": "K1191",
    "name": "TRIMUNE 600MG 30CAPS",
    "lab": "VITALIS",
    "price": 8.99
  },
  {
    "ean": "2000000000292",
    "codigo": "K1545",
    "name": "TRIMUNE+VITC+D3+ZINCO+BETAGLUCANA 30CAPS",
    "lab": "VITALIS",
    "price": 23.89
  },
  {
    "ean": "2000000000293",
    "codigo": "K1425",
    "name": "TRIPTOFANO + MAGNESIO 60CAPS",
    "lab": "VITALIS",
    "price": 14.79
  },
  {
    "ean": "2000000000294",
    "codigo": "M8340",
    "name": "VAPORIZEN POM 12G",
    "lab": "DERMIX",
    "price": 4.4
  },
  {
    "ean": "2000000000295",
    "codigo": "M8339",
    "name": "VAPORIZEN POM 40G",
    "lab": "DERMIX",
    "price": 4.82
  },
  {
    "ean": "2000000000296",
    "codigo": "M4837",
    "name": "VASELINA  HIDRAT SOL 25G CONCARE",
    "lab": "DERMIX",
    "price": 6.09
  },
  {
    "ean": "2000000000297",
    "codigo": "M4833",
    "name": "VASELINA  HIDRAT SOL 70G CONCARE",
    "lab": "DERMIX",
    "price": 10.08
  },
  {
    "ean": "2000000000298",
    "codigo": "M5265",
    "name": "VASELINA LIQUIDA 100ML CONCARE",
    "lab": "DERMIX",
    "price": 11.33
  },
  {
    "ean": "2000000000299",
    "codigo": "M0007",
    "name": "VITACON A-Z C/30 CPS GELATINOSAS",
    "lab": "DERMIX",
    "price": 7.31
  },
  {
    "ean": "2000000000300",
    "codigo": "M15691",
    "name": "VITACON C 1G - (10 COMP )",
    "lab": "DERMIX",
    "price": 4.84
  },
  {
    "ean": "2000000000301",
    "codigo": "M600787",
    "name": "VITACON C KIT 30 COMP CONLIFE",
    "lab": "DERMIX",
    "price": 12.72
  },
  {
    "ean": "2000000000302",
    "codigo": "M258",
    "name": "VITACON C ZINCO 10S DERMIX",
    "lab": "DERMIX",
    "price": 3.4
  },
  {
    "ean": "2000000000303",
    "codigo": "M6740",
    "name": "VITACON C+ARGININA 10S",
    "lab": "DERMIX",
    "price": 14.91
  },
  {
    "ean": "2000000000304",
    "codigo": "M2143",
    "name": "VITACON C+D+ZINCO KIT 30S DERMIX",
    "lab": "DERMIX",
    "price": 22.45
  },
  {
    "ean": "2000000000305",
    "codigo": "M14988",
    "name": "VITACON C+D+ZINCO TRIPLA AÇÃO - (10 COMP)",
    "lab": "DERMIX",
    "price": 4.28
  },
  {
    "ean": "2000000000306",
    "codigo": "M1158",
    "name": "VITACON D 2000UI 30S DERMIX",
    "lab": "DERMIX",
    "price": 11.35
  },
  {
    "ean": "2000000000307",
    "codigo": "M126565",
    "name": "VITACON D 20ML",
    "lab": "DERMIX",
    "price": 8.2
  },
  {
    "ean": "2000000000308",
    "codigo": "M579",
    "name": "VITACON JR LARANJA 240ML DERMIX",
    "lab": "DERMIX",
    "price": 10.78
  },
  {
    "ean": "2000000000309",
    "codigo": "M193870",
    "name": "VITACON JR MORANGO 240ML DERMIX",
    "lab": "DERMIX",
    "price": 16.03
  },
  {
    "ean": "2000000000310",
    "codigo": "M400",
    "name": "VITACON PHYTUS 60 S CONLIFE",
    "lab": "DERMIX",
    "price": 29.16
  },
  {
    "ean": "2000000000311",
    "codigo": "M600863",
    "name": "VITACON Q10 60S DERMIX",
    "lab": "DERMIX",
    "price": 17.64
  },
  {
    "ean": "2000000000312",
    "codigo": "M654",
    "name": "VITACON SENIOR BAUNIL 400G DERMIX",
    "lab": "DERMIX",
    "price": 37.6
  },
  {
    "ean": "2000000000313",
    "codigo": "M649",
    "name": "VITACON SENIOR CHOCOLATE 400G DERMIX",
    "lab": "DERMIX",
    "price": 40.84
  },
  {
    "ean": "2000000000314",
    "codigo": "M653",
    "name": "VITACON SENIOR MORANGO 400G DERMIX",
    "lab": "DERMIX",
    "price": 34.05
  },
  {
    "ean": "2000000000315",
    "codigo": "M1159",
    "name": "VITACON SULF FERROSO 93MG 100S",
    "lab": "DERMIX",
    "price": 7.09
  },
  {
    "ean": "2000000000316",
    "codigo": "M1320",
    "name": "VITACONZITOS ORODISP LAR 60S",
    "lab": "DERMIX",
    "price": 5.88
  },
  {
    "ean": "2000000000317",
    "codigo": "M148395",
    "name": "VITAMINA B12 60 COMP DERMIX",
    "lab": "DERMIX",
    "price": 16.45
  },
  {
    "ean": "2000000000318",
    "codigo": "K1426",
    "name": "VITAMINA C 1.000MG 30CPR",
    "lab": "VITALIS",
    "price": 9.92
  },
  {
    "ean": "2000000000319",
    "codigo": "K1439",
    "name": "VITAMINA D 2.000UIs 30CAPS",
    "lab": "VITALIS",
    "price": 14.5
  },
  {
    "ean": "2000000000320",
    "codigo": "K1427",
    "name": "VITAMINA E 15MG 60CAPS SOFTGEL",
    "lab": "VITALIS",
    "price": 12.66
  },
  {
    "ean": "2000000000321",
    "codigo": "K1440",
    "name": "VITAMINA E 400MG SOFTGEL 30CAPS",
    "lab": "VITALIS",
    "price": 7.15
  },
  {
    "ean": "2000000000322",
    "codigo": "K1428",
    "name": "ZINCO QUELATO DOSE MAXIMA 60CAPS",
    "lab": "VITALIS",
    "price": 13.11
  }
];
