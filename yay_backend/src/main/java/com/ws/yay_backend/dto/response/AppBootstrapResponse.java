package com.ws.yay_backend.dto.response;

import java.util.List;

public record AppBootstrapResponse(
    List<GetCommunityResponse> communities,
    UserInfoResponse user
) {
}
