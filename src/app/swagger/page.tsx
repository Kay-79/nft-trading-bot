"use client";
import React, { useEffect } from "react";

const SwaggerPage = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js";
        script.async = true;
        script.onload = () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (window.SwaggerUIBundle) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                window.SwaggerUIBundle({
                    url: "/api/swagger",
                    dom_id: "#swagger-ui"
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh"
            }}
        >
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
            <div id="swagger-ui" />
        </div>
    );
};

export default SwaggerPage;
