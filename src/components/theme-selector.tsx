"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { themes } from "@/lib/constants";

export function ThemeSelector() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	return (
		<RadioGroup
			value={theme?.split("-")[0]}
			onValueChange={(value) => {
				setTheme(`${value}-${resolvedTheme || "light"}`);
			}}
			className="space-y-2"
		>
			{themes.map((themeOption) => (
				<div key={themeOption.value} className="flex items-center space-x-2">
					<RadioGroupItem
						value={themeOption.value}
						id={themeOption.value}
					/>
					<Label
						htmlFor={themeOption.value}
						className="flex items-center space-x-2"
					>
						<span>{themeOption.name}</span>
					</Label>
				</div>
			))}
		</RadioGroup>
	);
}
