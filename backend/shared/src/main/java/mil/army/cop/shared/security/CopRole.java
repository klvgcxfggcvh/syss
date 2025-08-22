package mil.army.cop.shared.security;

public enum CopRole {
    HQ("ROLE_HQ"),
    UNIT("ROLE_UNIT"),
    OBSERVER("ROLE_OBSERVER");

    private final String authority;

    CopRole(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }
}
