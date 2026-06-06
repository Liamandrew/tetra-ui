import { Button } from "@repo/tetra-ui/components/button";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@repo/tetra-ui/components/menu";
import { MenuPreview } from "@/components/previews";
import { ScreenHero, ScreenScrollView } from "@/components/screen";

export default function MenuScreen() {
  return (
    <ScreenScrollView>
      <ScreenHero className="bg-background">
        <MenuPreview />
      </ScreenHero>

      <ScreenHero>
        <Menu>
          <MenuTrigger>
            <Button>Nested</Button>
          </MenuTrigger>

          <MenuContent>
            <MenuItem onPress={() => console.log("Item 1")}>
              <MenuItemIcon
                icon={MenuItemIcon.select({
                  android: require("@expo/material-symbols/counter_1.xml"),
                  ios: "1.circle",
                })}
              />
              <MenuItemLabel>Item 1</MenuItemLabel>
            </MenuItem>

            <MenuSub>
              <MenuSubTrigger>
                <MenuItem onPress={() => console.log("Item 2")}>
                  <MenuItemIcon
                    icon={MenuItemIcon.select({
                      android: require("@expo/material-symbols/counter_2.xml"),
                      ios: "2.circle",
                    })}
                  />
                  <MenuItemLabel>Item 2</MenuItemLabel>
                </MenuItem>
              </MenuSubTrigger>
              <MenuSubContent>
                <MenuItem onPress={() => console.log("Sub Item 1")}>
                  <MenuItemIcon
                    icon={MenuItemIcon.select({
                      android: require("@expo/material-symbols/open_in_full.xml"),
                      ios: "arrow.up.left.and.arrow.down.right",
                    })}
                  />
                  <MenuItemLabel>Sub Item 1</MenuItemLabel>
                </MenuItem>
                <MenuItem onPress={() => console.log("Sub Item 2")}>
                  <MenuItemIcon
                    icon={MenuItemIcon.select({
                      android: require("@expo/material-symbols/close_fullscreen.xml"),
                      ios: "arrow.down.right.and.arrow.up.left",
                    })}
                  />
                  <MenuItemLabel>Sub Item 2</MenuItemLabel>
                </MenuItem>
              </MenuSubContent>
            </MenuSub>
          </MenuContent>
        </Menu>
      </ScreenHero>

      <ScreenHero>
        <Menu>
          <MenuTrigger>
            <Button variant="outline">Layout</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuGroup title="My Account">
              <MenuItem onPress={() => console.log("Profile")}>
                <MenuItemIcon
                  icon={MenuItemIcon.select({
                    android: require("@expo/material-symbols/person.xml"),
                    ios: "person",
                  })}
                />
                <MenuItemLabel>Profile</MenuItemLabel>
              </MenuItem>
              <MenuItem onPress={() => console.log("Billing")}>
                <MenuItemIcon
                  icon={MenuItemIcon.select({
                    android: require("@expo/material-symbols/credit_card.xml"),
                    ios: "creditcard",
                  })}
                />
                <MenuItemLabel>Billing</MenuItemLabel>
              </MenuItem>
            </MenuGroup>

            <MenuSeparator />

            <MenuGroup direction="horizontal" title="Quick Actions">
              <MenuItem onPress={() => console.log("Add")}>
                <MenuItemIcon
                  icon={MenuItemIcon.select({
                    android: require("@expo/material-symbols/add.xml"),
                    ios: "plus",
                  })}
                />
              </MenuItem>
              <MenuItem onPress={() => console.log("Search")}>
                <MenuItemIcon
                  icon={MenuItemIcon.select({
                    android: require("@expo/material-symbols/search.xml"),
                    ios: "magnifyingglass",
                  })}
                />
              </MenuItem>
              <MenuItem onPress={() => console.log("Share")}>
                <MenuItemIcon
                  icon={MenuItemIcon.select({
                    android: require("@expo/material-symbols/share.xml"),
                    ios: "square.and.arrow.up",
                  })}
                />
              </MenuItem>
            </MenuGroup>
          </MenuContent>
        </Menu>
      </ScreenHero>
    </ScreenScrollView>
  );
}
