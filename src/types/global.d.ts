import { ComponentPropsWithoutRef } from "react";

declare type ButtonType = ComponentPropsWithoutRef<"button">;
declare type ImageType = ComponentPropsWithoutRef<"img">;
declare type DivType = ComponentPropsWithoutRef<"div">;
declare type SVGType = ComponentPropsWithoutRef<"svg">;
declare type AnchorType = ComponentPropsWithoutRef<"a">;

declare type PageType = { isLoggedIn: boolean };
