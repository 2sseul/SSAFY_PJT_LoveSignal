package kr.lovesignal.fileservice.util;

import kr.lovesignal.fileservice.exception.ErrorCode;
import kr.lovesignal.fileservice.model.response.ErrorResponse;
import kr.lovesignal.fileservice.model.response.SuccessResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ResponseUtils<T> {

    public SuccessResponse<T> buildSuccessResponse(T body) {
        return SuccessResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .body(body)
                .build();
    }

    public ErrorResponse buildErrorResponse(ErrorCode error, String path){
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(error.getHttpStatus().value())
                .error(error.name())
                .message(error.getMessage())
                .path(path)
                .build();
    }
}