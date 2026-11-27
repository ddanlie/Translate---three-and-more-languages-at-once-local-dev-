import { 
    postData, 
    getData, 
    // patchData, 
    // putData, 
    // deleteData,
    // uploadFile
} from "@/src/utils/api/axios_api_utils.ts";



//Template:
//service_<serviceGroup>_<specificBehavior>_<sync/async>_<additionalInfo>

export interface TranslateTextToManyLanguagesBody {
    text: string;
    sourceLanguage: string;
    targetLanguages: Array<string>;
}

export const service_translate_aiTranslate_async_translateTextToManylanguages = async (body: TranslateTextToManyLanguagesBody): Promise<Array<string>> => {
    const requestBody = {
        text: body.text,
        source_language: body.sourceLanguage,
        target_languages: body.targetLanguages
    };
    return postData<Array<string>>(
        '/api/translate/ai_translate',
        requestBody
    );
};

export const service_translate_aiTranslate_async_getSupportedLanguages = async (): Promise<Record<string, string>> => {
    return getData<Record<string, string>>(
        '/api/translate/ai_translate/supported_languages'
    );
};