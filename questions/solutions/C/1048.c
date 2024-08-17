bool isSubsequence(string &a, string &b){
    int i=0;
        int j=0;
        while(i<a.size()&&j<b.size()){
            if(a[i]==b[j])
                i++;
            j++;
        }

        if(i==a.size())
            return true;
    
    return false;
    
}
int recurse(vector<string>& words, int idx, int prev){
    if(idx==words.size())
        return 0;
    if(prev==-1){
        return  max(recurse(words,idx+1,prev), 1+recurse(words,idx+1,idx));
    }
    int maxi=0;
    if(words[prev].size()==words[idx].size()-1&&isSubsequence(words[prev],words[idx])){
            maxi= 1 + recurse(words,idx+1,idx);
    }
    else if(words[prev].size()==words[idx].size()-2)
        return 0;
    return max(maxi,recurse(words,idx+1,prev));
    
}

static bool comparator(string &a, string &b){
    return a.size()<b.size();
}

int longestStrChain(vector<string>& words) {
    sort(words.begin(),words.end(),comparator);
    return recurse(words,0,-1);
}