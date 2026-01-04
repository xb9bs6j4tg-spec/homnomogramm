# Interactive Nomogram — Positive Lymph Node Prediction

An interactive web-based nomogram for predicting the probability of positive lymph node involvement in prostate cancer patients, based on multivariable logistic regression analysis.

## Features

- **Interactive sliders** for all three predictor variables
- **Real-time nomogram visualization** showing contribution of each variable
- **Predicted probability display** with visual bar
- **Editable regression coefficients** for model customization
- **Responsive design** that works on desktop and mobile

## Variables

1. **Gleason Grade Group** (MRI-fusion biopsy): 1–5
2. **Preoperative PSA**: 0–1000 ng/mL
3. **Maximum diameter of suspicious lesion**: 0–200 mm

## Regression Model

The model uses logistic regression:

$$P(y=1) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_1 + \beta_2 x_2 + \beta_3 x_3)}}$$

### Default Coefficients (from multivariable analysis)

| Variable | Coefficient (β) | Std. Error |
|----------|-----------------|------------|
| Intercept | -9.079 | 1.779 |
| Gleason Grade Group | 0.934 | 0.325 |
| PSA (ng/mL) | 0.099 | 0.047 |
| Diameter (mm) | 0.131 | 0.046 |

## How to Use

### Locally (Static HTML)

1. Open `index.html` in any modern web browser.
2. Adjust the sliders to change input values.
3. The nomogram and predicted probability update in real-time.
4. Optionally modify the regression coefficients and click "Restore default coefficients" to reset.

### Running a Local Server

If you prefer to serve the files locally (e.g., to ensure proper CORS or for deployment testing):

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Files

- **index.html**: Main HTML structure with input controls and display areas
- **styles.css**: Complete styling with responsive layout
- **app.js**: JavaScript logic for calculations and real-time updates
- **README.md**: This file

## Customization

### Change the Regression Coefficients

Edit the `defaults` object in `app.js`:

```javascript
const defaults = {
  intercept: -9.079,
  b_gleason: 0.934,
  b_psa: 0.099,
  b_diam: 0.131
};
```

Or update the default values in the HTML `<input>` elements and modify them dynamically using the web interface.

### Adjust Input Ranges

In `index.html`, modify the `min`, `max`, and `step` attributes of the sliders:

```html
<input id="gleason" type="range" min="1" max="5" step="1" value="3">
<input id="psa" type="range" min="0" max="1000" step="1" value="10">
<input id="diam" type="range" min="0" max="200" step="1" value="12">
```

## Technical Details

- **Frontend Framework**: Vanilla JavaScript (no external dependencies)
- **Styling**: CSS Grid and Flexbox for responsive layout
- **Calculation**: Logistic regression using the sigmoid function

## Browser Compatibility

Works on all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.

## License

This tool is provided for educational and research purposes.

---

**Created for:** Interactive nomogram visualization  
**Date:** January 2026
