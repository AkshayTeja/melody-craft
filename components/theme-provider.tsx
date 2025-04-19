"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import React from "react";

export default function NextAuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<SessionProvider>
				<ThemeProvider attribute={"class"}>{children}</ThemeProvider>
		</SessionProvider>
	);
}