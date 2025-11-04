{{-- .ai/guidelines/statamic.blade.php --}}

=== Statamic Guidelines ===

## General Rules
- ALWAYS use Antlers for all views, components, and partials
- ALWAYS use the `antlers.html` file extension for all views
- ALWAYS use an underscore `_` prefix for partials and components that are not reusable
- Individual pages should use corresponding Antlers partials for layout and content
- Individual pages should use separate blueprints for each custom page

## Directory Structure
- ALL standalone pages should be placed within `resources/views/pages`
- ALL page-specific partials should be placed within `resources/views/partials`, separated by page type
- ALL common and reusable page (buttons, etc.) components should be placed within `resources/views/components` for reusable
