import Alpine from 'alpinejs';
import { createIcons, User, Library, House } from 'lucide';
Alpine.start();

createIcons({
    icons: {
        House,
        Library,
        User,
    },
});
