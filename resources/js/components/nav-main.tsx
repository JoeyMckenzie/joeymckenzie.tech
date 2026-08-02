import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="font-mono text-[0.65rem] tracking-[0.18em] text-subtle uppercase">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = isCurrentOrParentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                isActive={isActive}
                                className="relative font-mono text-subtle before:absolute before:inset-y-1.5 before:left-0 before:w-px before:rounded-full before:bg-iris before:opacity-0 hover:bg-canvas hover:text-prose focus-visible:ring-iris data-[active=true]:bg-canvas data-[active=true]:text-iris data-[active=true]:before:opacity-100"
                                tooltip={{
                                    children: item.title,
                                    className:
                                        'border-hairline bg-panel font-mono text-prose',
                                }}
                                render={
                                    <Link
                                        href={item.href}
                                        prefetch
                                        aria-current={
                                            isActive ? 'location' : undefined
                                        }
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                }
                            />
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
