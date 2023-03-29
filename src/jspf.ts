import mergeOptions from 'merge-options';
import z from 'zod';

export default class JSPF {

  // Allow user to specify default parameters
  default: object = {
    doThrows: {
      invalidTrack: false
    }
  };

  /**
   * Return a new object by adding missing keys into another object
   */
  validateSettings(settings: any, defaults: any) {
    return mergeOptions(defaults, settings);
  }

  public parse(objects: [] | object, params: object, callback?: Function): any {
    let geojson,
      settings = this.validateSettings(params, this.default),
      propFunc;

    console.log("SETTINGS",settings);

  }

  public validatePlaylist(data:object){

    //checks the string is an URI
    const isUriString = (str:string) => {
      str.trim();
      try {
        new URL(str);
        return true;
      } catch (err) {
        return false;
      }
    }

    //checks that the object has maximum one property
    const isSinglePropObj = (obj:object) => {
      return Object.keys(obj).length <= 1;
    }

    //check all keys of this object are URIs
    const ObjIsUriKeys = (obj:object) => {
      return Object.keys(obj).every(k => isUriString(k));
    }

    //check that value is an array
    //https://stackoverflow.com/a/8511350
    const isObject = (input:any) => {
      return (
        typeof input === 'object' &&
        !Array.isArray(input) &&
        input !== null
      )
    }

    //check all values of this object are URIs
    const ArrayIsObjectValues = (arr:object[]) => {
      return arr.every(v => isObject(v));
    }

    //check all values of this object are URIs
    const ObjIsUriValues = (obj:object) => {
      return Object.values(obj).every(v => isUriString(v));
    }

    const trimmedStringSchema = z.string().trim();
    const urlSchema = trimmedStringSchema.url();
    const arrayOfUrlsSchema = urlSchema.array();
    const arrayOfObjectsSchema = z.object({}).array();
    const numberSchema = z.number();
    const integerSchema = numberSchema.int();
    const nonNegativeIntegerSchema = integerSchema.nonnegative();
    const datetimeSchema = trimmedStringSchema.datetime({ offset: true });

    //link
    const linkSchema = z.object({})
    .refine((obj) => {
      return isSinglePropObj(obj);
    },
    {
      message:
        "The object can contain only one property."
    })
    .refine((obj) => {
      return ObjIsUriKeys(obj);
    },
    {
      message:
        "The object property name should be an URI."
    })
    .refine((obj) => {
      return ObjIsUriValues(obj);
    },
    {
      message:
        "The object property value should be an URI."
    })
    .array();

    //meta
    const metaSchema = z.object({})
    .refine((obj) => {
      return isSinglePropObj(obj);
    },
    {
      message:
        "The object can contain only one property."
    })
    .refine((obj) => {
      return ObjIsUriKeys(obj);
    },
    {
      message:
        "The object property name should be an URI."
    })
    .array();

    //extension
    //TO FIX TO CHECK - what about the value ?
    const extensionSchema = z.object({})
    .refine((obj) => {
      return ObjIsUriKeys(obj);
    },
    {
      message:
        "The object property name should be an URI."
    })

    //attribution
    const attributionSchema = z.object({})
    .refine((obj) => {
      return isSinglePropObj(obj);
    },
    {
      message:
        "The object can contain only one property."
    })
    .refine((obj) => {
      return ObjIsUriValues(obj);
    },
    {
      message:
        "The object property value should be an URI."
    })
    .array();


    const schema = z.object({
      title: trimmedStringSchema,
      creator: trimmedStringSchema,
      annotation: trimmedStringSchema,
      info: urlSchema,
      location:urlSchema,
      identifier:urlSchema,
      image:urlSchema,
      date:datetimeSchema,
      license:urlSchema,
      attribution:attributionSchema,
      link:linkSchema,
      meta:metaSchema,
      extension:extensionSchema,
      track:z.object({
        location: arrayOfUrlsSchema,
        identifier: arrayOfUrlsSchema,
        title: trimmedStringSchema,
        creator: trimmedStringSchema,
        annotation: trimmedStringSchema,
        info: urlSchema,
        image: urlSchema,
        album: trimmedStringSchema,
        trackNum:nonNegativeIntegerSchema,
        duration:nonNegativeIntegerSchema,
        link:linkSchema,
        meta:metaSchema,
        extension:extensionSchema
      }).array()
    })

    type ValidatePayload = z.infer<typeof schema>

    const payload = data as ValidatePayload;

    const parseSchema = (props: ValidatePayload) => {
      return schema.parse(props)
    }

    const result = parseSchema(payload)
    console.log(JSON.stringify(result))
  }

}
