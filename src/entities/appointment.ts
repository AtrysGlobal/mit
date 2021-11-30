import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { HttpErrorNew } from '../handlers/base-error';

const sharedData = SharedData.getInstance();

export async function reserveInmediate(): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');

    if(!sharedData.integrationClientIdentificator) throw new Error('The integrationClientIdentificator property is mandatory, must set in sharedData')

    const obj = {
      integrationClientIdentificator: sharedData.integrationClientIdentificator,
      integrationExternalId: sharedData.integrationExternalId
    }

    const _req = await _request.post('/appointments/immediate/', obj);
    if (_req.data.message !== 'OK') {
      throw new Error(_req.data.message);
    }

    if (_req.data) sharedData.appopintmentReservedId = _req.data.payload._id;

    return _req;
  } catch (error: any) {
    throw new HttpErrorNew(error);
  }
}

export async function consolidateInmediate(symptoms: string[]): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');

    if (!sharedData.appopintmentReservedId) 
      throw new Error(
        'For consolidate a new appointment you must provide an appointment id, throught reserve method, or define in sharedData class',
      );


    const payload = {
      id: sharedData.appopintmentReservedId,
      patientDetails: { symptoms },
    };

    const _req = await _request.post('/appointments/immediate/consolidate/', { ...payload });

    if (_req.data.message !== 'OK') {
      throw new Error(_req.data.message);
    }

    return _req;
  } catch (error: any) {
    throw new HttpErrorNew(error);
  }
}

export async function reserveSheduled(reservePayload: any): Promise<object> {
  try {

    if(!sharedData.integrationClientIdentificator) throw new Error('The integrationClientIdentificator property is mandatory, must set in sharedData')

    reservePayload.integrationClientIdentificator = sharedData.integrationClientIdentificator;
    reservePayload.integrationExternalId = sharedData.integrationExternalId;

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.post('/appointments/reserve/', { ...reservePayload });

    if (_req.data) {
      if (_req.data.message !== 'Resource created'){
        throw new Error(_req.data.message);
      }

      sharedData.appopintmentReservedId = _req.data.payload.id;
    }

    return _req;
  } catch (error: any) {
    throw new HttpErrorNew(error);
  }
}

export async function consolidateSheduled(symptoms: string[]): Promise<object> {
  try {
    const _request = new ClientRequest('ATRYS');

    if (!sharedData.appopintmentReservedId)
      throw new Error(
        'For consolidate a new appointment you must provide an appointment id, throught reserve method, or define in sharedData class',
      );

    const payload = {
      id: sharedData.appopintmentReservedId,
      patientDetails: { symptoms },
    };

    const _req = await _request.post('/appointments/consolidate/', { ...payload });

    if (_req.data.message !== 'OK') {
      throw new Error(_req.data.message);
    }

    return _req;
  } catch (error: any) {
    throw new HttpErrorNew(error);
  }
}

export async function getAppointmentIdByExternalId(): Promise<object>{
  try {
    const externalId = sharedData.integrationExternalId

    if(!externalId) throw new Error('The externalId argument is mandatory')

    const _request = new ClientRequest('ATRYS');
    const _req = await _request.get(`/integrations/appointments/inmediate/${externalId}`);

    return _req.data.payload;

  } catch (error: any) {
    throw new HttpErrorNew(error);
  }
}

export default { reserveInmediate, consolidateInmediate, reserveSheduled, consolidateSheduled };
