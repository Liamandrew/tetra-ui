import { Button, ButtonIcon } from "@repo/tetra-ui/components/button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuSeparator,
  MenuTrigger,
} from "@repo/tetra-ui/components/menu";
import { Platform } from "react-native";
import { EllipsisVerticalIcon } from "@/components/ui/icons";

export function MenuPreview() {
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
