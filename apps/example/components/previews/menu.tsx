import { Button, ButtonIcon } from "@repo/tetra-ui/components/button";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuSeparator,
  MenuTrigger,
} from "@repo/tetra-ui/components/menu";
import { useState } from "react";
import { Platform } from "react-native";
import { EllipsisVerticalIcon } from "@/components/ui/icons";

export function MenuPreview() {
  const [sort, setSort] = useState<"name" | "date">("name");

  return (
    <Menu>
      <MenuTrigger>
        <Button size="icon" variant="link">
          <ButtonIcon>
            <EllipsisVerticalIcon />
          </ButtonIcon>
        </Button>
      </MenuTrigger>

      <MenuContent>
        <MenuGroup title="Sort by">
          <MenuItem
            onPress={() => setSort("name")}
            selected={sort === "name"}
          >
            <MenuItemIcon
              icon={Platform.select({
                android: require("@expo/material-symbols/sort_by_alpha.xml"),
                ios: "textformat",
              })}
            />
            <MenuItemLabel>Name</MenuItemLabel>
          </MenuItem>
          <MenuItem
            onPress={() => setSort("date")}
            selected={sort === "date"}
          >
            <MenuItemIcon
              icon={Platform.select({
                android: require("@expo/material-symbols/calendar_today.xml"),
                ios: "calendar",
              })}
            />
            <MenuItemLabel>Date</MenuItemLabel>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem onPress={() => console.log("Settings")}>
          <MenuItemIcon
            icon={Platform.select({
              android: require("@expo/material-symbols/settings.xml"),
              ios: "gear",
            })}
          />
          <MenuItemLabel>Settings</MenuItemLabel>
        </MenuItem>
        <MenuItem onPress={() => console.log("Profile")}>
          <MenuItemIcon
            icon={Platform.select({
              android: require("@expo/material-symbols/person.xml"),
              ios: "person",
            })}
          />
          <MenuItemLabel>Profile</MenuItemLabel>
        </MenuItem>
        <MenuItem disabled>
          <MenuItemIcon
            icon={Platform.select({
              android: require("@expo/material-symbols/archive.xml"),
              ios: "archivebox",
            })}
          />
          <MenuItemLabel>Archive</MenuItemLabel>
        </MenuItem>
        <MenuSeparator />
        <MenuItem onPress={() => console.log("Delete")} variant="destructive">
          <MenuItemIcon
            icon={Platform.select({
              android: require("@expo/material-symbols/delete.xml"),
              ios: "trash",
            })}
          />
          <MenuItemLabel>Delete</MenuItemLabel>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
