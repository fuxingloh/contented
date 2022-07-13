import { MoonIcon, SunIcon } from "@heroicons/react/outline";
import { ComponentProps, useEffect, useState } from "react";

enum Theme {
  Dark = "dark",
  Light = "light",
}

export default function ThemeButton(props: ComponentProps<any>) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>();

  useEffect(() => {
    if (selectedTheme) {
      document.documentElement.setAttribute("data-theme", selectedTheme);
    } else {
      const theme = document.documentElement.getAttribute("data-theme");
      setSelectedTheme(theme as Theme);
    }
  }, [selectedTheme]);

  return (
    <div {...props}>
      <button className="flex items-center">
        <SunIcon
          className="hidden h-6 w-6 [[data-theme=light]_&]:block"
          onClick={() => setSelectedTheme(Theme.Dark)}
        />
        <MoonIcon
          className="hidden h-6 w-6 [[data-theme=dark]_&]:block"
          onClick={() => setSelectedTheme(Theme.Light)}
        />
        <SunIcon
          className="hidden h-6 w-6 [:not(.dark)[data-theme=system]_&]:block"
          onClick={() => setSelectedTheme(Theme.Dark)}
        />
        <MoonIcon
          className="hidden h-6 w-6 [.dark[data-theme=system]_&]:block"
          onClick={() => setSelectedTheme(Theme.Light)}
        />
      </button>
    </div>
  );
}
