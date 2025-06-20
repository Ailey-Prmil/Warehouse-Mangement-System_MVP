"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type Props = {
  url: string;
};

function ReactSwagger({ url }: Props) {
  return <SwaggerUI url={url} />;
}

export default ReactSwagger;
