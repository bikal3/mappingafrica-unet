// Single source of truth for figures the site displays in more than one place.
// Keep in sync with demo/api/main.py and the evaluation notebook.

export const SAMPLE_IDS = [
  "ZM1622949_2021-08", "ZM1634599_2021-08", "ZM1634645_2021-08", "ZM1656379_2021-08",
  "ZM1702968_2021-08", "ZM1706637_2021-08", "ZM1712155_2021-08", "ZM1716286_2021-08",
  "ZM1717612_2021-08", "ZM1719919_2021-08", "ZM1829067_2021-08", "ZM1841419_2021-08",
  "ZM1858604_2021-08", "ZM1888408_2021-08", "ZM1911527_2021-08", "ZM1921657_2021-08",
  "ZM1933346_2021-08", "ZM1935028_2021-08", "ZM1975354_2021-08", "ZM1986959_2021-08",
  "ZM2011173_2021-08", "ZM2033581_2021-08", "ZM2079799_2021-08", "ZM2096868_2021-08",
  "ZM2117591_2021-08", "ZM2131550_2021-08", "ZM2137844_2021-08", "ZM2139930_2021-08",
  "ZM2145201_2021-08", "ZM2160265_2021-08", "ZM2169968_2021-08", "ZM2187890_2021-08",
  "ZM2211915_2021-08", "ZM2213703_2021-08", "ZM2219002_2021-08", "ZM2220204_2021-08",
  "ZM2236432_2021-08", "ZM2264538_2021-08", "ZM2267070_2021-08", "ZM2275008_2021-08",
  "ZM2288316_2021-08", "ZM2293344_2021-08", "ZM2295370_2021-08", "ZM2295847_2021-08",
  "ZM2304141_2021-08", "ZM2304231_2021-08", "ZM2305901_2021-08", "ZM2310085_2021-08",
  "ZM2310176_2021-08", "ZM2311332_2021-08",
];

export const EPOCHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const TRAINING_METRICS = {
  trainLoss: [0.5446, 0.5035, 0.4776, 0.4597, 0.4486, 0.4458, 0.4408, 0.4320, 0.4272, 0.4229],
  valLoss:   [0.5567, 0.5133, 0.4811, 0.4809, 0.4626, 0.4538, 0.4587, 0.4555, 0.4503, 0.4456],
  valAcc:    [0.7891, 0.8018, 0.8147, 0.8091, 0.8181, 0.8224, 0.8190, 0.8188, 0.8193, 0.8210],
  valMiou:   [0.3994, 0.4072, 0.4099, 0.4126, 0.4109, 0.4136, 0.4148, 0.4116, 0.4154, 0.4118],
};

export const FINAL_METRICS = {
  pixelAccuracy: 0.8179,
  miou: 0.4331,
  mnistAccuracy: 0.9899,
};

// Segmentation classes. The colours MUST match CLASS_COLORS in
// demo/convert_images.py and demo/api/main.py — they are the colours actually
// painted into the mask PNGs, and this legend is how a reader decodes them.
export const CLASS_LEGEND = [
  { id: 0, color: "#3c3c3c", name: "Non-field",      desc: "Land outside any agricultural field" },
  { id: 1, color: "#228b22", name: "Field interior", desc: "Inside a cultivated field boundary" },
  { id: 2, color: "#1e90ff", name: "Field boundary", desc: "The edge separating adjacent fields" },
];

// Mean pixel share across the 50 test tiles, measured from the label masks.
export const CLASS_SHARE = { 0: 69, 1: 29, 2: 2 };
