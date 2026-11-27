import { useMutation, useQuery } from "@tanstack/react-query";
import {
    service_translate_aiTranslate_async_translateTextToManylanguages,
    service_translate_aiTranslate_async_getSupportedLanguages,  
} from "./index"

// Bodies types
import {
    TranslateTextToManyLanguagesBody
} from "./index"

import * as useQueryConfigPatterns from "@/src/utils/api/use_query_config_patterns.ts";



const queryKeys = {
    use_service_translate_aiTranslate_async_getSupportedLanguages: "use_service_translate_aiTranslate_async_getSupportedLanguages",
    service_translate_aiTranslate_async_translateTextToManylanguages: "service_translate_aiTranslate_async_translateTextToManylanguages"
}
//args: config - useQueryConfig. You can use patterns 
export const use_service_translate_aiTranslate_async_getSupportedLanguages = ({config={}}) => {
    return useQuery({
        queryKey: [
            queryKeys.use_service_translate_aiTranslate_async_getSupportedLanguages,
        ],
        queryFn: () => service_translate_aiTranslate_async_getSupportedLanguages(),
        ...config
    });
};

export const use_service_translate_aiTranslate_async_translateTextToManylanguages = ({phrase_querykey, body, config={}} : {phrase_querykey: string, body: TranslateTextToManyLanguagesBody, config?: any}) => {
    return useQuery({
        queryKey: [
            queryKeys.service_translate_aiTranslate_async_translateTextToManylanguages,
            phrase_querykey,
        ],
        queryFn: () => service_translate_aiTranslate_async_translateTextToManylanguages(body),
        ...config
    });
};
