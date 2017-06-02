//notes.js


// open ID Standard requirements for validating Tokens
2.2.1.  ID Token Validation

If any of the validation procedures defined in this document fail, any operations requiring the information that failed to correctly validate MUST be aborted and the information that failed to validate MUST NOT be used.

To validate the ID Token in the Authorization Response, the Client MUST do the following:

The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery) MUST exactly match the value of the iss (issuer) Claim.
The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience. The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
If the ID Token contains multiple audiences, the Client SHOULD verify that an azp Claim is present.
If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg Header Parameter of the JOSE Header. The Client MUST use the keys provided by the Issuer.
The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the OpenID Connect Core 1.0 [OpenID.Core] specification.
The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account for clock skew).
The iat Claim can be used to reject tokens that were issued too far away from the current time, limiting the amount of time that nonces need to be stored to prevent attacks. The acceptable range is Client specific.
The value of the nonce Claim MUST be checked to verify that it is the same value as the one that was sent in the Authentication Request. The Client SHOULD check the nonce value for replay attacks. The precise method for detecting replay attacks is Client specific.
If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate. The meaning and processing of acr Claim Values is out of scope for this document.
When a max_age request is made, the Client SHOULD check the auth_time Claim value and request re-authentication if it determines too much time has elapsed since the last End-User authentication.