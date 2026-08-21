import axios from 'axios';
import { cloudServerUrl, serverAppId } from '../../Utils.js';

export default async function GetTemplate(request) {
  const serverUrl = cloudServerUrl; //process.env.SERVER_URL;
  const templateId = request.params.templateId;
  const sessiontoken = request.headers?.sessiontoken;
  try {
    let userEmail;
    let userId;
    if (sessiontoken) {
      const userRes = await axios.get(serverUrl + '/users/me', {
        headers: {
          'X-Parse-Application-Id': serverAppId,
          'X-Parse-Session-Token': sessiontoken,
        },
      });
      userEmail = userRes.data && userRes.data.email;
      userId = userRes.data && userRes.data.objectId;
    }
    if (templateId && userEmail) {
      try {
        const extUserQuery = new Parse.Query('contracts_Users');
        extUserQuery.equalTo('Email', userEmail);
        extUserQuery.include('TeamIds');
        const extUser = await extUserQuery.first({ useMasterKey: true });
        const accessQueries = [];

        const globalQuery = new Parse.Query('contracts_Template');
        globalQuery.equalTo('IsGlobal', true);
        accessQueries.push(globalQuery);

        const createdByQuery = new Parse.Query('contracts_Template');
        createdByQuery.equalTo('CreatedBy', {
          __type: 'Pointer',
          className: '_User',
          objectId: userId,
        });
        accessQueries.push(createdByQuery);

        if (extUser) {
          const _extUser = JSON.parse(JSON.stringify(extUser));
          const extUserPtr = {
            __type: 'Pointer',
            className: 'contracts_Users',
            objectId: extUser.id,
          };

          const ownedByExtUserQuery = new Parse.Query('contracts_Template');
          ownedByExtUserQuery.equalTo('ExtUserPtr', extUserPtr);
          accessQueries.push(ownedByExtUserQuery);

          const sharedWithUsersQuery = new Parse.Query('contracts_Template');
          sharedWithUsersQuery.equalTo('SharedWithUsers', extUserPtr);
          accessQueries.push(sharedWithUsersQuery);

          const teamsArr = [
            ...new Set((_extUser?.TeamIds || []).flatMap(team => team.Ancestors || [])),
          ];
          if (teamsArr.length > 0) {
            const sharedWithTeamQuery = new Parse.Query('contracts_Template');
            sharedWithTeamQuery.containedIn('SharedWith', teamsArr);
            accessQueries.push(sharedWithTeamQuery);
          }
        }

        const template = Parse.Query.or(...accessQueries);
        template.equalTo('objectId', templateId);
        template.notEqualTo('IsArchive', true);
        template.include('ExtUserPtr');
        template.include('Signers');
        template.include('CreatedBy');
        template.include('ExtUserPtr.TenantId');
        template.include('Placeholders.signerPtr');
        template.include('Bcc');
        template.include('Cc');
        const res = await template.first({ useMasterKey: true });
        if (res) {
          const templateRes = JSON.parse(JSON.stringify(res));
          delete templateRes?.ExtUserPtr?.TenantId?.FileAdapters;
          delete templateRes?.ExtUserPtr?.TenantId?.PfxFile;
          return templateRes;
        } else {
          return { error: "template deleted or you don't have access." };
        }
      } catch (err) {
        console.log('err', err);
        return err;
      }
    } else {
      return { error: "template deleted or you don't have access." };
    }
  } catch (err) {
    console.log('err', err);
    if (err?.response?.data?.code === 209 || err.code == 209) {
      return { error: 'Invalid session token' };
    } else {
      return { error: "template deleted or you don't have access." };
    }
  }
}
