import _ from 'lodash';

export const formatWorkItems = (workItemsFilteredByParents: any[]): any[] => {
    return _.map(workItemsFilteredByParents, (workItem) => {
        let workItemFinal = {},
            workItemOptimized = _.mapValues(_.pick(workItem, ['fields', 'relations']), (propValue, propName) => { 
                let returnValue = {};

                returnValue['fields'] = _.pick(propValue, [
                    'System.Id',
                    'System.AreaPath',
                    'System.CommentCount',
                    'System.Description',
                    'System.IterationPath',
                    'System.State',
                    'System.Title',
                    'System.WorkItemType',
                    'Microsoft.VSTS.Common.AcceptanceCriteria',
                    'Microsoft.VSTS.Common.BacklogPriority',
                    'Microsoft.VSTS.Common.Priority',
                    'Microsoft.VSTS.Scheduling.Effort',
                ]);

                returnValue['relations'] = _.map(_.filter(propValue, (relation) => relation['rel'] === 'System.LinkTypes.Hierarchy-Forward'), (relation) => parseInt(relation['url'].split('/workItems/')[1], 0));

                return returnValue[propName] || propValue;
            });

        workItemFinal['item'] = _.mapKeys(workItemOptimized['fields'], (fieldValue, fieldKey) => {
            const keyMap = {};
            keyMap['System.AreaPath'] = 'areaPath';
            keyMap['System.CommentCount'] = 'commentCount';
            keyMap['System.Description'] = 'description';
            keyMap['System.IterationPath'] = 'iterationPath';
            keyMap['System.State'] = 'state';
            keyMap['System.Title'] = 'title';
            keyMap['System.WorkItemType'] = 'workItemType';
            keyMap['Microsoft.VSTS.Common.AcceptanceCriteria'] = 'acceptanceCriteria';
            keyMap['Microsoft.VSTS.Common.BacklogPriority'] = 'backlogPriority';
            keyMap['Microsoft.VSTS.Common.Priority'] = 'priority';
            keyMap['Microsoft.VSTS.Scheduling.Effort'] = 'effort';

            return keyMap[fieldKey] || 'error';
        });

        workItemFinal['item'].id = workItemFinal['item'].id || workItem.id;

        workItemFinal['children'] = workItemOptimized['relations'];

        return workItemFinal;
    });
};
