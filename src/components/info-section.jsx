import { fundraiserInfo } from "@/stateVariables";
import { useStore } from "@nanostores/react";
import { marked } from 'marked';

export default function InfoSection(brand) {
    const $fundraiserInfo = useStore(fundraiserInfo);
    const description = marked.parse($fundraiserInfo.description);

    return (
        <div class="flex flex-col gap-4 mt-6">
            <h1 class="text-4xl font-bold text-center lg:text-left">{$fundraiserInfo.title}</h1>
            <p set:html={description}></p>
            <div class="border-t border-gray-500"></div>
            <div class="flex items-center gap-4 mb-2">
                <img class="w-10 h-10 rounded-full" src={brand_logo} alt="Rounded brand logo" />
                <div>
                    <p class="font-semibold text-lg">{brand}</p>
                    <p class="text-sm text-gray-400">{brand_description}</p>
                </div>
            </div>
        </div>
    )
}