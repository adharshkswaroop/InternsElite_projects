"""
Uber Ride Prediction Flask Application
Main application file using modular architecture.
"""

from flask import Flask, request, render_template, jsonify
from src.components.prediction import create_prediction_engine
from src.config.config import APP_HOST, APP_PORT, DEBUG, TEMPLATE_DIR, STATIC_DIR

# Initialize Flask app
app = Flask(__name__, 
            template_folder=TEMPLATE_DIR,
            static_folder=STATIC_DIR)

# Initialize prediction engine
try:
    prediction_engine = create_prediction_engine()
    print("Prediction engine initialized successfully!")
except Exception as e:
    print(f"Error initializing prediction engine: {str(e)}")
    prediction_engine = None


@app.route('/')
def home():
    """
    Render the home page.
    
    Returns:
        Rendered HTML template
    """
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    """
    Handle prediction requests from the form.
    
    Returns:
        Rendered HTML template with prediction results
    """
    try:
        if prediction_engine is None:
            return render_template('index.html', 
                                 prediction_text="Error: Model not loaded")
        
        # Get form data
        form_values = [x for x in request.form.values()]
        
        # Make prediction
        prediction_value, prediction_message = prediction_engine.predict_from_form(form_values)
        
        return render_template('index.html', 
                             prediction_text=prediction_message)
    
    except ValueError as e:
        return render_template('index.html', 
                             prediction_text="Error: Invalid input values")
    except Exception as e:
        return render_template('index.html', 
                             prediction_text=f"Error: {str(e)}")


@app.route('/api/predict', methods=['POST'])
def api_predict():
    """Return a prediction as JSON for the live estimation workflow."""
    try:
        if prediction_engine is None:
            return jsonify({"error": "Model not loaded"}), 503

        payload = request.get_json(silent=True) or request.form
        form_values = [payload.get(field) for field in (
            "Priceperweek", "Population", "Monthlyincome",
            "Averageparkingpermonth"
        )]
        prediction_value, prediction_message = prediction_engine.predict_from_form(form_values)
        return jsonify({
            "prediction": prediction_value,
            "message": prediction_message,
            "status": "success"
        })
    except (ValueError, TypeError):
        return jsonify({"error": "Enter a valid number in every field."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/health')
def health():
    """
    Health check endpoint.
    
    Returns:
        JSON response with health status
    """
    status = {
        "status": "healthy" if prediction_engine is not None else "unhealthy",
        "model_loaded": prediction_engine is not None
    }
    return status


if __name__ == '__main__':
    app.run(host=APP_HOST, port=APP_PORT, debug=DEBUG)
