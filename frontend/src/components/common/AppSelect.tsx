import React from 'react';
import Select, {
  components,
  type MenuProps,
  type Props as ReactSelectProps,
  type StylesConfig,
} from 'react-select';

export type AppSelectOption = {
  value: string | number;
  label: string;
};

type AppSelectProps<Option extends AppSelectOption> = Omit<
  ReactSelectProps<Option, false>,
  'options' | 'value' | 'onChange' | 'menuPortalTarget' | 'menuPosition'
> & {
  options: readonly Option[];
  value?: string | number | null;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
};

const selectStyles = (size: 'sm' | 'md'): StylesConfig<AppSelectOption, false> => {
  const height = size === 'sm' ? '2.25rem' : '3rem';

  return {
    control: (base, state) => ({
      ...base,
      height,
      minHeight: height,
      borderWidth: 1,
      borderColor: state.isFocused ? 'oklch(var(--p))' : 'oklch(var(--b3))',
      borderRadius: 'var(--redwood-radius-control, 0.25rem)',
      boxShadow: state.isFocused ? '0 0 0 3px oklch(var(--p) / 0.14)' : 'none',
      backgroundColor: 'oklch(var(--b1))',
      color: 'oklch(var(--bc))',
      cursor: 'text',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
      '&:hover': { borderColor: state.isFocused ? 'oklch(var(--p))' : 'oklch(var(--bc) / 0.3)' },
    }),
    valueContainer: (base) => ({ ...base, padding: '0 0.75rem' }),
    input: (base) => ({ ...base, height: '1.25rem', minHeight: 0, margin: 0, padding: 0, color: 'oklch(var(--bc))' }),
    placeholder: (base) => ({ ...base, color: 'oklch(var(--bc) / 0.55)' }),
    singleValue: (base) => ({ ...base, color: 'oklch(var(--bc))' }),
    indicatorSeparator: (base) => ({ ...base, margin: '0.5rem 0', backgroundColor: 'oklch(var(--bc) / 0.2)' }),
    dropdownIndicator: (base) => ({ ...base, padding: '0.625rem', color: 'oklch(var(--bc) / 0.6)' }),
    clearIndicator: (base) => ({ ...base, padding: '0.625rem', color: 'oklch(var(--bc) / 0.6)' }),
    menu: (base) => ({ ...base, marginTop: '0.5rem', border: 0, boxShadow: 'none', backgroundColor: 'transparent' }),
    menuList: (base) => ({ ...base, maxHeight: '18rem', padding: 0 }),
    option: (base, state) => ({
      ...base,
      minHeight: size === 'sm' ? '2.25rem' : '2.75rem',
      padding: '0.625rem 0.75rem',
      borderRadius: 'var(--redwood-radius-control, 0.25rem)',
      color: state.isSelected ? 'oklch(var(--pc))' : 'oklch(var(--bc))',
      backgroundColor: state.isSelected ? 'oklch(var(--p))' : state.isFocused ? 'oklch(var(--b2))' : 'transparent',
      ':active': { backgroundColor: 'oklch(var(--p))', color: 'oklch(var(--pc))' },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 100 }),
  };
};

const AppSelectMenu: React.FC<MenuProps<AppSelectOption, false>> = (props) => (
  <components.Menu {...props}>
    <div className="overflow-hidden rounded-box border border-base-300 bg-base-100 p-2 shadow-redwood-lg">
      {props.children}
    </div>
  </components.Menu>
);

const AppSelect = <Option extends AppSelectOption>({
  options,
  value,
  onChange,
  size = 'md',
  className,
  components: selectComponents,
  ...props
}: AppSelectProps<Option>) => (
  <Select<Option, false>
    {...props}
    className={`app-react-select ${className ?? ''}`}
    value={options.find((option) => String(option.value) === String(value ?? '')) ?? null}
    options={options}
    onChange={(option) => onChange(option ? String(option.value) : '')}
    styles={selectStyles(size) as StylesConfig<Option, false>}
    components={{ ...selectComponents, Menu: AppSelectMenu as React.ComponentType<MenuProps<Option, false>> }}
    menuPortalTarget={document.body}
    menuPosition="fixed"
  />
);

export default AppSelect;
