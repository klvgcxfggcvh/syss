package mil.army.cop.shared.exception;

public class CopException extends RuntimeException {
    private final String errorCode;

    public CopException(String message) {
        super(message);
        this.errorCode = "COP_ERROR";
    }

    public CopException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public CopException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "COP_ERROR";
    }

    public String getErrorCode() {
        return errorCode;
    }
}
