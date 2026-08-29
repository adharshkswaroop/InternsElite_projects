"""Train and persist the Uber ride prediction model."""

from src.data.data_loader import prepare_data
from src.models.model_trainer import train_and_save_model


if __name__ == "__main__":
	X_train, X_test, y_train, y_test = prepare_data()
	train_and_save_model(X_train, y_train, X_test, y_test)
