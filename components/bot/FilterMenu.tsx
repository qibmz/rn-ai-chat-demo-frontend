import { Box } from '@/components/ui/box';
import { CheckIcon, Icon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { SEARCH_FILTERS, type SearchFilterId } from '@/lib/bot/types';
import React from 'react';

type FilterMenuProps = {
  value: SearchFilterId;
  onChange: (id: SearchFilterId) => void;
  trigger: (props: Record<string, unknown>) => React.ReactNode;
};

/** 搜索筛选：基于 gluestack Menu */
export function FilterMenu({ value, onChange, trigger }: FilterMenuProps) {
  return (
    <Menu placement="bottom right" offset={8} trigger={trigger} className="rounded-3xl">
      {SEARCH_FILTERS.map((item) => {
        const selected = value === item.id;
        return (
          <MenuItem
            key={item.id}
            textValue={item.label}
            onPress={() => onChange(item.id)}
            className="min-w-36">
            <Box className="h-5 w-5 items-center justify-center">
              {selected ? <Icon as={CheckIcon} size="sm" className="text-foreground" /> : null}
            </Box>
            <MenuItemLabel>{item.label}</MenuItemLabel>
          </MenuItem>
        );
      })}
    </Menu>
  );
}
