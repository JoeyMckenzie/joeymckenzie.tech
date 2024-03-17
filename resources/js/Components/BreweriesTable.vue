<script lang="ts" setup>
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Brewery } from '@/types';

defineProps<{
    breweries: Brewery[];
}>();

const getFormattedAddress = (brewery: Brewery) =>
    `${brewery.city}, ${brewery.state}`;
const hasWebsiteLink = (brewery: Brewery) =>
    !!brewery.website_url && brewery.website_url.length > 0;
</script>

<template>
    <div class="pb-4 sm:pb-16">
        <h2
            class="pb-4 pt-8 text-right text-4xl font-bold tracking-tight sm:text-center"
        >
            Breweries.
        </h2>
        <div class="mx-auto max-w-3xl">
            <Table>
                <TableCaption
                    >Powered by
                    <a class="hover:underline" href="https://openbrewerydb.org/"
                        >Open Brewery DB</a
                    >.
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Brewery</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Website</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow
                        v-for="brewery in breweries.filter(hasWebsiteLink)"
                        :key="brewery.id"
                    >
                        <TableCell class="font-medium">
                            {{ brewery.name }}
                        </TableCell>
                        <TableCell
                            >{{ getFormattedAddress(brewery) }}
                        </TableCell>
                        <TableCell
                            ><a
                                :href="brewery.website_url"
                                class="hover:underline"
                                rel="noreferrer"
                                >Link</a
                            ></TableCell
                        >
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>
