import React from "react";
import { Box, Flex } from "@codeday/topo/Atom";
import { useColorModeValue } from "@codeday/topo/Theme";

export default function InfoBox({
  children,
  heading,
  headingSize,
  buttons,
  nested,
  ...props
}) {
  return (
    <Box
      d="block"
      m={nested ? 0 : 1}
      rounded={5}
      backgroundColor={useColorModeValue(
        nested ? "gray.1200" : undefined,
        nested ? "gray.1000" : "gray.1200"
      )}
      {...props}
    >
      {heading && (
        <Flex
          backgroundColor={useColorModeValue(
            nested ? "gray.100" : "gray.200",
            nested ? "red.800" : "red.700"
          )}
          fontSize={headingSize}
          justifyContent="space-between"
          fontWeight="bold"
          rounded={5}
          pl={1}
          pr={1}
          p={1}
          align="center"
        >
          <Box pl={2}>{heading}</Box>
          <Box>{buttons}</Box>
        </Flex>
      )}
      <Box rounded={5} p={1} m={2}>
        {children}
      </Box>
    </Box>
  );
}
